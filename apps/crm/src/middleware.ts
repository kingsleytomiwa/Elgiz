import { Category, Position, User } from "@prisma/client";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const user = (req.nextauth.token as any).user as User;

    if (user.position === "OWNER") {
      return;
    }

    switch (req.nextUrl.pathname) {
      case "/spa": {
        if (!user.sections?.includes(Category.SPA)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      case "/reception": {
        if (!user.sections?.includes(Category.RECEPTION)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      case "/restaurant": {
        if (!user.sections?.includes(Category.RESTAURANT)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      case "/room-service": {
        if (!user.sections?.includes(Category.ROOM_SERVICE)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      case "/chat": {
        if (!user.sections?.includes(Category.CHAT)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!public|static|images|_next|favicon.ico|login|forgot-password|reset-password|api/v1/*).*)",
  ],
};
