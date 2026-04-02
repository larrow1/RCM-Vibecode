"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { FileUpload } from "@/components/import/file-upload";
import { DataPreview } from "@/components/import/data-preview";
import { TaxonomyMapper } from "@/components/import/taxonomy-mapper";
import { Card, CardTitle } from "@/components/shared/card";

interface ParsedData {
  headers: string[];
  rows: Array<{ rowIndex: number; values: Record<string, string | number> }>;
  errors: string[];
  detectedColumns: {
    accountCodeColumn: string | null;
    accountNameColumn: string | null;
    amountColumns: string[];
  };
}

export default function ImportPage() {
  const params = useParams();
  const router = useRouter();
  const engagementId = params.id as string;

  const [step, setStep] = useState<"upload" | "preview" | "mapping">("upload");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [entity, setEntity] = useState("Acme Corp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setLoading(true);
    setError(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import/parse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error ?? "Failed to parse file");
      }

      const data = await res.json();
      setParsedData(data);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!parsedData) return;
    setLoading(true);
    setError(null);

    const { detectedColumns, rows } = parsedData;
    const periodMappings = detectedColumns.amountColumns.map((col, idx) => ({
      column: col,
      period: `2024-${String(idx + 1).padStart(2, "0")}`,
    }));

    try {
      const res = await fetch("/api/import/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engagementId,
          entity,
          statementType: "ProfitAndLoss",
          periodType: "Monthly",
          currency: "USD",
          sourceFileName: fileName,
          accountNameColumn:
            detectedColumns.accountNameColumn ?? parsedData.headers[0],
          accountCodeColumn: detectedColumns.accountCodeColumn,
          periodAmountMappings: periodMappings,
          rows,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error ?? "Failed to import");
      }

      router.push(`/engagements/${engagementId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="Import Financial Data"
        subtitle={`Upload Excel or CSV financial statements`}
      />

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "upload" && (
        <Card>
          <CardTitle>Upload File</CardTitle>
          <div className="mt-4">
            <FileUpload onFileSelected={handleFileSelected} />
          </div>
          {loading && (
            <p className="mt-4 text-sm text-gray-500">Parsing file...</p>
          )}
        </Card>
      )}

      {step === "preview" && parsedData && (
        <div className="space-y-6">
          <Card>
            <CardTitle>Preview: {fileName}</CardTitle>
            <p className="mb-4 text-sm text-gray-500">
              {parsedData.rows.length} rows detected across{" "}
              {parsedData.headers.length} columns
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Entity Name
              </label>
              <input
                type="text"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <DataPreview
              headers={parsedData.headers}
              rows={parsedData.rows}
              maxRows={10}
            />

            {parsedData.errors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-red-600">
                  Parse warnings:
                </p>
                {parsedData.errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-500">
                    {e}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm">
              <p className="font-medium">Detected columns:</p>
              <p>
                Account name:{" "}
                {parsedData.detectedColumns.accountNameColumn ?? "Not detected"}
              </p>
              <p>
                Account code:{" "}
                {parsedData.detectedColumns.accountCodeColumn ?? "Not detected"}
              </p>
              <p>
                Amount columns:{" "}
                {parsedData.detectedColumns.amountColumns.join(", ") || "None"}
              </p>
            </div>
          </Card>

          <div className="flex gap-3">
            <button
              onClick={handleConfirmImport}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Importing..." : "Confirm Import"}
            </button>
            <button
              onClick={() => {
                setStep("upload");
                setParsedData(null);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Upload Different File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
