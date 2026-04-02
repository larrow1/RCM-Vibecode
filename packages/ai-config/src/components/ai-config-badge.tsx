"use client";

import { AI_PROVIDERS, type AIConfig } from "../providers";

interface AIConfigBadgeProps {
  config: AIConfig | null;
  onClick?: () => void;
}

/**
 * Small badge showing current AI config status.
 * Use in headers/sidebars to show connection state and allow quick access to config.
 */
export function AIConfigBadge({ config, onClick }: AIConfigBadgeProps) {
  if (!config) {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
      >
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        No AI Model
      </button>
    );
  }

  const provider = AI_PROVIDERS[config.providerId];
  const model = provider.models.find((m) => m.id === config.modelId);

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
    >
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {provider.name}: {model?.name ?? config.modelId}
    </button>
  );
}
