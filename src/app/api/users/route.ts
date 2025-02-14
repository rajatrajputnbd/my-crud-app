import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
      const token = cookies().get("token")?.value;
  
      if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
  
      jwt.verify(token, process.env.JWT_SECRET as string);
  
      await connectDB();
      const users = await User.find({}, "-password");
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  }

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}


