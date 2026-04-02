import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const engagements = await prisma.engagement.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(engagements);
  } catch {
    return NextResponse.json({ error: "Failed to fetch engagements" }, { status: 500 });
  }
}
