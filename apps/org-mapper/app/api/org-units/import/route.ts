import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCsvToOrgUnits } from "@/lib/org-utils";

export async function POST(request: NextRequest) {
  try {
    const { engagementId, mapping, rows } = await request.json();

    if (!engagementId || !mapping || !rows) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const engagement = await prisma.engagement.findUnique({ where: { id: engagementId } });
    if (!engagement) {
      return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
    }

    const { units, errors } = parseCsvToOrgUnits(rows, mapping);

    // Create org units and build ID map for parent resolution
    const idMap = new Map<string, string>(); // employeeId -> db id
    const createdUnits: { id: string; name: string; managerName: string | null; employeeId: string | null }[] = [];

    for (const unit of units) {
      const created = await prisma.orgUnit.create({
        data: {
          engagementId,
          name: unit.name,
          title: unit.title,
          department: unit.department,
          type: unit.type,
          level: unit.level,
          headcount: unit.headcount,
          totalCompensation: unit.totalCompensation,
          managerName: unit.managerName,
          managerTitle: unit.managerTitle,
          employeeId: unit.employeeId,
        },
      });
      createdUnits.push({
        id: created.id,
        name: created.name,
        managerName: unit.managerName,
        employeeId: unit.employeeId,
      });
      if (unit.employeeId) {
        idMap.set(unit.employeeId, created.id);
      }
      // Also map by name for fallback resolution
      idMap.set(unit.name, created.id);
    }

    // Resolve parent relationships using manager name
    let resolvedCount = 0;
    for (const unit of createdUnits) {
      if (unit.managerName) {
        const parentId = idMap.get(unit.managerName);
        if (parentId && parentId !== unit.id) {
          await prisma.orgUnit.update({
            where: { id: unit.id },
            data: { parentId },
          });
          resolvedCount++;
        }
      }
    }

    // Log the import
    await prisma.importLog.create({
      data: {
        engagementId,
        fileName: "csv-import",
        rowCount: rows.length,
        successCount: createdUnits.length,
        errorCount: errors.length,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
      },
    });

    return NextResponse.json({
      successCount: createdUnits.length,
      errorCount: errors.length,
      resolvedRelationships: resolvedCount,
      errors,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed" },
      { status: 500 }
    );
  }
}
