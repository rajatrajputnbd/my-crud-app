import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  console.log("TOKEN FROM COOKIE:", token);
  console.log("COOKIES:", req.cookies.getAll());

  if (!token) {
    console.log("No token found, redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const [header, payload, signature] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));

    if (decodedPayload.exp * 1000 < Date.now()) {
      console.error("Token has expired.");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Token is valid, granting access.");
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/"],
};
