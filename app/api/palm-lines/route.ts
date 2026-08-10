import { NextResponse } from 'next/server'
import { getPalmLines } from '@/lib/content'

export async function GET() {
  return NextResponse.json(getPalmLines())
}
