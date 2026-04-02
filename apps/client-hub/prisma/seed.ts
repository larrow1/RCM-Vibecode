import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.engagement.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.client.deleteMany();

  // Create clients with contacts and engagements
  const acmeCorp = await prisma.client.create({
    data: {
      name: "Acme Corporation",
      industry: "Manufacturing",
      website: "https://acme.example.com",
      notes: "Long-standing client since 2020. Key relationship managed by Diana.",
      status: "Active",
      contacts: {
        create: [
          {
            name: "John Smith",
            email: "john.smith@acme.example.com",
            phone: "+1-555-0101",
            role: "VP of Operations",
            isPrimary: true,
          },
          {
            name: "Jane Doe",
            email: "jane.doe@acme.example.com",
            phone: "+1-555-0102",
            role: "Project Manager",
          },
        ],
      },
      engagements: {
        create: [
          {
            name: "Operations Transformation",
            description: "End-to-end review and optimization of manufacturing operations",
            type: "FixedFee",
            status: "Active",
            startDate: new Date("2026-01-15"),
            endDate: new Date("2026-06-30"),
            budget: 250000,
          },
          {
            name: "Supply Chain Assessment",
            description: "Assessment of supply chain resilience and recommendations",
            type: "TM",
            status: "Delivered",
            startDate: new Date("2025-06-01"),
            endDate: new Date("2025-09-30"),
            budget: 120000,
          },
        ],
      },
    },
  });

  const globalTech = await prisma.client.create({
    data: {
      name: "Global Tech Solutions",
      industry: "Technology",
      website: "https://globaltech.example.com",
      status: "Active",
      contacts: {
        create: [
          {
            name: "Sarah Chen",
            email: "sarah.chen@globaltech.example.com",
            phone: "+1-555-0201",
            role: "CTO",
            isPrimary: true,
          },
        ],
      },
      engagements: {
        create: [
          {
            name: "Cloud Migration Strategy",
            description: "Develop cloud migration roadmap and execute Phase 1",
            type: "TM",
            status: "Active",
            startDate: new Date("2026-02-01"),
            endDate: new Date("2026-08-31"),
            budget: 400000,
          },
        ],
      },
    },
  });

  const meridian = await prisma.client.create({
    data: {
      name: "Meridian Financial Group",
      industry: "Financial Services",
      website: "https://meridianfg.example.com",
      status: "Prospect",
      contacts: {
        create: [
          {
            name: "Robert Williams",
            email: "rwilliams@meridianfg.example.com",
            phone: "+1-555-0301",
            role: "CEO",
            isPrimary: true,
          },
          {
            name: "Lisa Park",
            email: "lpark@meridianfg.example.com",
            role: "Head of Strategy",
          },
        ],
      },
      engagements: {
        create: [
          {
            name: "Digital Transformation Proposal",
            description: "Proposal for comprehensive digital transformation program",
            type: "FixedFee",
            status: "Proposal",
            budget: 600000,
          },
        ],
      },
    },
  });

  const greenEnergy = await prisma.client.create({
    data: {
      name: "GreenEnergy Partners",
      industry: "Energy",
      status: "Active",
      contacts: {
        create: [
          {
            name: "Michael Torres",
            email: "mtorres@greenenergy.example.com",
            role: "Director of Strategy",
            isPrimary: true,
          },
        ],
      },
      engagements: {
        create: [
          {
            name: "Market Entry Analysis",
            description: "Analysis of European market entry opportunities",
            type: "Retainer",
            status: "Active",
            startDate: new Date("2026-03-01"),
            budget: 15000,
          },
        ],
      },
    },
  });

  const oldClient = await prisma.client.create({
    data: {
      name: "Legacy Systems Inc",
      industry: "Technology",
      status: "Inactive",
      notes: "Engagement completed in 2025. Good relationship, may re-engage.",
      contacts: {
        create: [
          {
            name: "David Kim",
            email: "dkim@legacysystems.example.com",
            role: "VP Engineering",
            isPrimary: true,
          },
        ],
      },
      engagements: {
        create: [
          {
            name: "Technical Debt Audit",
            description: "Comprehensive audit of technical debt and remediation plan",
            type: "FixedFee",
            status: "Closed",
            startDate: new Date("2025-03-01"),
            endDate: new Date("2025-06-30"),
            budget: 85000,
          },
        ],
      },
    },
  });

  console.log("Seed data created successfully:");
  console.log(`  - ${5} clients`);
  console.log(`  - Contacts and engagements created for each client`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
