import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  const users = await prisma.user.findMany();
  const returnUsers = users.map((user) => {
    return {
      id: user.id,
      email: user.email,
    };
  });
  return NextResponse.json(returnUsers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (
      !body.username ||
      !body.password ||
      typeof body.username != "string" ||
      typeof body.password != "string"
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: body.username },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (isPasswordValid) {
      return NextResponse.json({ id: user.id, email: user.email });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Authorization error:", error);
    return NextResponse.json({ error: "Failed to authorize" }, { status: 500 });
  }
}
