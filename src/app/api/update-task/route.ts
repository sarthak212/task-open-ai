import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("body ", body);
  const task = await prisma.task.update({
    where: { id: body.id },
    data: body.data,
  });
  return NextResponse.json(task);
}
