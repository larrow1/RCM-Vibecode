import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const existing = await prisma.teamMember.findUnique({
      where: { id: params.memberId },
    });
    if (!existing || existing.engagementId !== params.id) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    await prisma.teamMember.delete({
      where: { id: params.memberId },
    });

    await prisma.activity.create({
      data: {
        engagementId: params.id,
        type: "team_member_added",
        description: `${existing.name} removed from team`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
