import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các routes không cần xác thực
const publicRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Nếu đang ở trang public và đã đăng nhập -> chuyển về dashboard
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Nếu chưa đăng nhập và không phải trang public -> chuyển về login
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

// Cấu hình các routes cần được middleware xử lý
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 