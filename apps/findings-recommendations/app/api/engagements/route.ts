import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const engagements = await prisma.engagement.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        clientName: true,
        status: true,
      },
    });

    return NextResponse.json(engagements);
  } catch (error) {
    console.error("Failed to fetch engagements:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagements" },
      { status: 500 }
    );
  }
}
