
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const urlPath = req.nextUrl.pathname;
  const targetUuid = urlPath.split('/')[2];
  if (!token && urlPath !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (token && urlPath === '/login') {
    return NextResponse.redirect(new URL(`/dashboard/${token}`, req.url));
  }
  if (targetUuid && token !== targetUuid) {
    return NextResponse.redirect(new URL(`/dashboard/${token}`, req.url));
  }
  // return NextResponse.redirect(new URL('/service', req))
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};