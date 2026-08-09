import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { prisma } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE ?? 5 * 1024 * 1024)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const RETENTION_DAYS = 30

export async function POST(request: Request) {
  let file: File | null = null

  try {
    const formData = await request.formData()
    const candidate = formData.get('file')
    if (candidate instanceof File) file = candidate
  } catch {
    return NextResponse.json(
      { error: 'Požadavek se nepodařilo přečíst.', code: 'INVALID_FORM_DATA' },
      { status: 400 },
    )
  }

  if (!file) {
    return NextResponse.json(
      { error: 'Nebyl přiložen žádný soubor.', code: 'NO_FILE' },
      { status: 400 },
    )
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      {
        error: `Soubor je příliš velký (maximum je ${Math.round(MAX_UPLOAD_SIZE / 1024 / 1024)} MB).`,
        code: 'FILE_TOO_LARGE',
      },
      { status: 413 },
    )
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: 'Nepodporovaný formát. Použijte JPG, PNG nebo WebP.',
        code: 'UNSUPPORTED_FORMAT',
      },
      { status: 415 },
    )
  }

  try {
    const imageId = randomUUID()
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', imageId)
    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Zmenšení, komprese a odstranění EXIF (sharp metadata ve výchozím stavu zahazuje).
    const processed = await sharp(buffer)
      .rotate()
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    const processedPath = path.join(uploadDir, 'processed.jpg')
    await writeFile(processedPath, processed)

    const expiresAt = new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000)

    await prisma.uploadedImage.create({
      data: {
        id: imageId,
        analysisId: '',
        originalName: file.name,
        originalPath: '',
        processedPath: `/uploads/${imageId}/processed.jpg`,
        metadata: JSON.stringify({
          size: file.size,
          type: file.type,
          processedSize: processed.length,
          uploadedAt: new Date().toISOString(),
        }),
        expiresAt,
      },
    })

    return NextResponse.json({
      imageId,
      previewUrl: `/uploads/${imageId}/processed.jpg`,
      message: 'Fotografie byla nahrána. Nyní označte čáry a pahorky.',
    })
  } catch (error) {
    console.error('Nahrání selhalo:', error)
    return NextResponse.json(
      { error: 'Soubor se nepodařilo zpracovat. Zkuste jiný obrázek.', code: 'PROCESSING_ERROR' },
      { status: 500 },
    )
  }
}
