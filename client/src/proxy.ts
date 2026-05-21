import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Explicitly look for your backend's token
    const accessToken = request.cookies.get("accessToken")?.value;

    // 1. If they don't have the accessToken and try to access the dashboard
    if (!accessToken && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/authentication", request.url));
    }

    // 2. If they ALREADY have the accessToken and try to open login/auth pages
    if (accessToken && pathname.startsWith("/authentication")) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/dashboard/:path*", "/authentication/:path*"],
};
