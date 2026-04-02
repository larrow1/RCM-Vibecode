import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgUnitSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const engagementId = request.nextUrl.searchParams.get("engagementId");
  if (!engagementId) {
    return NextResponse.json({ error: "engagementId is required" }, { status: 400 });
  }

  const orgUnits = await prisma.orgUnit.findMany({
    where: { engagementId },
    orderBy: [{ level: "asc" }, { department: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(orgUnits);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = orgUnitSchema.parse(body);
    const orgUnit = await prisma.orgUnit.create({ data });
    return NextResponse.json(orgUnit, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create org unit" }, { status: 500 });
  }
}
