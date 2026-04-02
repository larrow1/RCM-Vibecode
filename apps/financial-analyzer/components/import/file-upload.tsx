"use client";

import { useCallback, useState } from "react";

export function FileUpload({
  onFileSelected,
  accept = ".xlsx,.csv",
  maxSizeMB = 10,
}: {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`File too large (${sizeMB.toFixed(1)}MB). Maximum is ${maxSizeMB}MB.`);
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "xlsx" && ext !== "csv") {
        setError("Only .xlsx and .csv files are accepted.");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected, maxSizeMB]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <p className="mb-2 text-sm text-gray-600">
          Drag and drop a file here, or click to browse
        </p>
        <p className="text-xs text-gray-400">
          Accepts .xlsx and .csv (max {maxSizeMB}MB)
        </p>
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="mt-4"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
