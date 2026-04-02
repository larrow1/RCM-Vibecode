import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bulkUpdateLineItemsSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { updates } = bulkUpdateLineItemsSchema.parse(body);

    const results = await Promise.all(
      updates.map((update) =>
        prisma.financialLineItem.update({
          where: { id: update.id },
          data: {
            standardCategory: update.standardCategory,
            subcategory: update.subcategory ?? undefined,
          },
        })
      )
    );

    return NextResponse.json({ updated: results.length });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
