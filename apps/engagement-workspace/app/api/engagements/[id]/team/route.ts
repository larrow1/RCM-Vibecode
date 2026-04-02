import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTeamMemberSchema } from "@/lib/schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const members = await prisma.teamMember.findMany({
      where: { engagementId: params.id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = createTeamMemberSchema.parse(body);

    const member = await prisma.teamMember.create({
      data: {
        engagementId: params.id,
        name: validated.name,
        role: validated.role,
        email: validated.email,
      },
    });

    await prisma.activity.create({
      data: {
        engagementId: params.id,
        type: "team_member_added",
        description: `${validated.name} added as ${validated.role}`,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to add team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
