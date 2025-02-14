import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // console.log("Raw Password:", password);
    // console.log("Hashed Password:", hashedPassword);

    const newUser = await User.create({ name, email, password: hashedPassword });

    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      console.error("JWT_SECRET is missing from environment variables!");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: "1h" });

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Error registering user" }, { status: 500 });
  }
}
