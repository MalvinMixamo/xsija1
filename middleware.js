
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const urlPath = req.nextUrl.pathname;
  const targetUuid = urlPath.split('/')[2];
  console.log("Objek Cookie:", role); 
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (targetUuid && token !== targetUuid) {
    return NextResponse.redirect(new URL(`/dashboard/${token}`, req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};