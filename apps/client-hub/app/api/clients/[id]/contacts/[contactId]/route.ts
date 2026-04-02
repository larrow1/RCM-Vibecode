import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateContactSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; contactId: string } }
) {
  try {
    const body = await request.json();
    const validated = updateContactSchema.parse(body);

    // If setting as primary, unset other primary contacts
    if (validated.isPrimary) {
      await prisma.contact.updateMany({
        where: { clientId: params.id, isPrimary: true, NOT: { id: params.contactId } },
        data: { isPrimary: false },
      });
    }

    const contact = await prisma.contact.update({
      where: { id: params.contactId },
      data: validated,
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; contactId: string } }
) {
  try {
    await prisma.contact.delete({
      where: { id: params.contactId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
