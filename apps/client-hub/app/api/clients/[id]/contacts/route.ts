import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createContactSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contacts = await prisma.contact.findMany({
    where: { clientId: params.id },
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(contacts);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = createContactSchema.parse(body);

    // If this contact is primary, unset other primary contacts
    if (validated.isPrimary) {
      await prisma.contact.updateMany({
        where: { clientId: params.id, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const contact = await prisma.contact.create({
      data: {
        ...validated,
        clientId: params.id,
      },
    });

    return NextResponse.json(contact, { status: 201 });
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
