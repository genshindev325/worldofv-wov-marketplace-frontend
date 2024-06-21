import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    // Support for legacy business claim pages
    if (url.pathname === "/business/scheckter") {
        url.pathname = "/business/claim/scheckter";
        return NextResponse.redirect(url);
    }
    if (url.pathname === "/business/wine-test") {
        url.pathname = "/business/claim/wine-test";
        return NextResponse.redirect(url);
    }
}
