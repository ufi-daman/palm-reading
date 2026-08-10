import { NextResponse } from 'next/server'
import { getHandTypes } from '@/lib/content'

export async function GET() {
  return NextResponse.json(getHandTypes())
}
