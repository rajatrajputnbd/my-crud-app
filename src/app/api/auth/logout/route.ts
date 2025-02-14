import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().delete("token");
    return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: "Error logging out" }, { status: 500 });
  }
}