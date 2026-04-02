import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { confirmImportSchema } from "@/lib/validations";
import { suggestCategory } from "@/lib/taxonomy";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = confirmImportSchema.parse(body);

    const createdStatements = [];

    // Create one FinancialStatement per period, with its line items
    for (const mapping of validated.periodAmountMappings) {
      const statement = await prisma.financialStatement.create({
        data: {
          engagementId: validated.engagementId,
          entity: validated.entity,
          statementType: validated.statementType,
          period: mapping.period,
          periodType: validated.periodType,
          currency: validated.currency,
          sourceFileName: validated.sourceFileName,
          lineItems: {
            create: validated.rows
              .filter((row) => {
                const val = row.values[mapping.column];
                return val !== undefined && val !== "" && val !== null;
              })
              .map((row, idx) => {
                const accountName = String(
                  row.values[validated.accountNameColumn] ?? ""
                );
                const accountCode = validated.accountCodeColumn
                  ? String(row.values[validated.accountCodeColumn] ?? "")
                  : undefined;
                const rawAmount = row.values[mapping.column];
                const amount =
                  typeof rawAmount === "number"
                    ? rawAmount
                    : parseFloat(String(rawAmount).replace(/[,$]/g, "")) || 0;

                return {
                  accountName,
                  accountCode,
                  amount,
                  standardCategory: suggestCategory(accountName),
                  sortOrder: idx,
                };
              }),
          },
        },
        include: { lineItems: true },
      });

      createdStatements.push(statement);
    }

    return NextResponse.json(
      {
        statementsCreated: createdStatements.length,
        totalLineItems: createdStatements.reduce(
          (sum, s) => sum + s.lineItems.length,
          0
        ),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Import confirm error:", error);
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}
