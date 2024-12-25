import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = /dashboard/;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.test(path);
  const access_token = req.cookies.get('access_token')?.value;
  const refresh_token = req.cookies.get('refresh_token')?.value;

  if (isProtectedRoute) {
    if (access_token) {
      const JwtPayloadExp = jwtDecode(access_token)?.exp;
      if (JwtPayloadExp) {
        const exp = new Date(JwtPayloadExp * 1000);
        console.log("exp", exp)
        console.log("new Date()", new Date())
        if (exp < new Date()) {
          console.log("access token expired", access_token)
          if (!refresh_token) {
            console.log("refresh token not found")
            return NextResponse.redirect(new URL("/auth", req.url));
          }

          console.log("refresh token found", refresh_token)

          try {
            const res = await fetch("https://server.jehad.ly/api/v1/auth/refresh", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh_token: refresh_token }),
            }
            );

            if (!res.ok) {
              const error = await res.json();
              throw new Error(JSON.stringify(error));
            }

            const data = await res.json();
            const payload = data;

            if (!payload) {
              return NextResponse.redirect(new URL("/auth", req.url));
            }

            req.cookies.set('access_token', payload.access_token, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), secure: true, sameSite: 'lax', path: '/' })
            req.cookies.set('refresh_token', payload.refresh_token, { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), secure: true, sameSite: 'lax', path: '/' })

            return NextResponse.redirect(new URL("/dashboard", req.url));
          } catch (error) {
            console.log("failed to refresh token", error)
            await deleteCookies(req);
            return NextResponse.redirect(new URL("/auth", req.nextUrl));
          }
        }
      }
    } else {
      console.log("access token not found")
      await deleteCookies(req);
      return NextResponse.redirect(new URL("/auth", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export const dynamic = 'force-dynamic';

async function deleteCookies(req: NextRequest) {
  try {
    req.cookies.delete("access_token")
    req.cookies.delete("refresh_token")
  } catch (error) {
    console.log("ERR DELETE COOKIES", error)
  }
}
