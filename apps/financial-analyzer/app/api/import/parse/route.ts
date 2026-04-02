import { NextResponse } from "next/server";
import { parseCsv, parseExcel, detectColumns } from "@/lib/import-parser";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let result;

    if (fileName.endsWith(".csv")) {
      const text = await file.text();
      result = parseCsv(text);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      result = parseExcel(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use .xlsx or .csv" },
        { status: 400 }
      );
    }

    const detectedColumns = detectColumns(result.headers);

    return NextResponse.json({
      headers: result.headers,
      rows: result.rows,
      errors: result.errors,
      detectedColumns,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}
