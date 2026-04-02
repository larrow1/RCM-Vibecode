import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClientSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: any = { archivedAt: null };
  if (status) where.status = status;
  if (search) where.name = { contains: search };

  const clients = await prisma.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { engagements: true, contacts: true } },
    },
  });

  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createClientSchema.parse(body);

    const client = await prisma.client.create({
      data: validated,
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
