import { NextResponse } from "next/server";
import { CATEGORY_LABELS } from "@/lib/validations";

export async function GET() {
  const categories = Object.entries(CATEGORY_LABELS).map(([slug, { name, description }]) => ({
    slug,
    name,
    description,
  }));
  return NextResponse.json(categories);
}
