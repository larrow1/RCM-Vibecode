"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CsvUploader } from "@/components/import/csv-uploader";
import { ColumnMapper } from "@/components/import/column-mapper";
import Link from "next/link";

export default function ImportPage() {
  const params = useParams();
  const router = useRouter();
  const engagementId = params.id as string;

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [parsed, setParsed] = useState(false);

  function handleParsed(h: string[], r: Record<string, string>[]) {
    setHeaders(h);
    setRows(r);
    setParsed(true);
  }

  function handleImported() {
    router.push(`/engagements/${engagementId}`);
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href={`/engagements/${engagementId}`} className="text-sm text-blue-600 hover:underline">
          &larr; Back to Engagement
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Import Org Data</h1>
        <p className="text-sm text-gray-500">
          Upload a CSV file with organizational data (employee names, titles, departments, managers, compensation).
        </p>
      </div>

      {!parsed ? (
        <CsvUploader onParsed={handleParsed} />
      ) : (
        <ColumnMapper
          headers={headers}
          rows={rows}
          engagementId={engagementId}
          onImported={handleImported}
        />
      )}
    </div>
  );
}
