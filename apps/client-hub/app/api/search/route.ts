import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = `%${q}%`;

  const [clients, contacts, engagements] = await Promise.all([
    prisma.client.findMany({
      where: {
        archivedAt: null,
        name: { contains: q },
      },
      take: 5,
      select: { id: true, name: true, industry: true, status: true },
    }),
    prisma.contact.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      },
      take: 5,
      select: { id: true, name: true, email: true, role: true, clientId: true, client: { select: { name: true } } },
    }),
    prisma.engagement.findMany({
      where: {
        name: { contains: q },
      },
      take: 5,
      select: { id: true, name: true, status: true, client: { select: { name: true } } },
    }),
  ]);

  const results = [
    ...clients.map((c) => ({
      type: "client" as const,
      id: c.id,
      title: c.name,
      subtitle: [c.industry, c.status].filter(Boolean).join(" \u00B7 "),
      href: `/clients/${c.id}`,
    })),
    ...contacts.map((c) => ({
      type: "contact" as const,
      id: c.id,
      title: c.name,
      subtitle: [c.role, c.client.name].filter(Boolean).join(" at "),
      href: `/clients/${c.clientId}`,
    })),
    ...engagements.map((e) => ({
      type: "engagement" as const,
      id: e.id,
      title: e.name,
      subtitle: [e.client.name, e.status].filter(Boolean).join(" \u00B7 "),
      href: `/engagements/${e.id}`,
    })),
  ];

  return NextResponse.json({ results });
}
