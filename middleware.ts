import { NextRequest, NextResponse } from 'next/server'

/**
 * Basic auth jen pro /admin. Bez nastaveného ADMIN_PASSWORD je /admin
 * nedostupné úplně (bezpečnější výchozí stav než "otevřeno pro každého"
 * na produkci, kde se proměnná zapomene nastavit).
 */
export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return new NextResponse('Administrace není nakonfigurována.', { status: 503 })
  }

  const auth = request.headers.get('authorization')
  const expected = 'Basic ' + Buffer.from(`admin:${adminPassword}`).toString('base64')

  if (auth !== expected) {
    return new NextResponse('Vyžadováno přihlášení.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Administrace"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
