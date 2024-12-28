import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard"] }

export async function middleware(request: NextRequest) {
const url = await request.nextUrl;
console.log("url is here",url)

  return NextResponse.next();
}