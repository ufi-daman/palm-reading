import { NextResponse } from 'next/server'
import { getMounts } from '@/lib/content'

export async function GET() {
  return NextResponse.json(getMounts())
}
