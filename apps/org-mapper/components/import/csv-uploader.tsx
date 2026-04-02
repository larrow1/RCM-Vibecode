"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";

interface CsvUploaderProps {
  onParsed: (headers: string[], rows: Record<string, string>[]) => void;
}

export function CsvUploader({ onParsed }: CsvUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`Parse error: ${results.errors[0].message}`);
            return;
          }
          const headers = results.meta.fields || [];
          const rows = results.data as Record<string, string>[];
          if (rows.length === 0) {
            setError("CSV file is empty");
            return;
          }
          onParsed(headers, rows);
        },
        error: (err) => {
          setError(`Failed to parse CSV: ${err.message}`);
        },
      });
    },
    [onParsed]
  );

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
      <input
        type="file"
        accept=".csv"
        id="csv-upload"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <label
        htmlFor="csv-upload"
        className="cursor-pointer inline-block rounded bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
      >
        Upload CSV File
      </label>
      {fileName && <p className="mt-3 text-sm text-gray-500">File: {fileName}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-gray-400">
        Expected columns: Name, Title, Department, Manager/ManagerName, Level, Compensation, EmployeeId
      </p>
    </div>
  );
}
