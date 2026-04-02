"use client";

import { useState, useCallback } from "react";
import {
  AI_PROVIDERS,
  providerIds,
  getModelsForProvider,
  validateApiKeyFormat,
  type ProviderId,
  type AIConfig,
} from "../providers";

interface AIConfigPanelProps {
  /** Current config (null if not yet configured) */
  config: AIConfig | null;
  /** Called when user saves a valid configuration */
  onSave: (config: AIConfig) => void;
  /** Called when user clears the configuration */
  onClear: () => void;
  /** Optional className for the container */
  className?: string;
}

export function AIConfigPanel({ config, onSave, onClear, className = "" }: AIConfigPanelProps) {
  const [providerId, setProviderId] = useState<ProviderId>(config?.providerId ?? "anthropic");
  const [modelId, setModelId] = useState(config?.modelId ?? AI_PROVIDERS.anthropic.models[0].id);
  const [apiKey, setApiKey] = useState(config?.apiKey ?? "");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(!!config);

  const provider = AI_PROVIDERS[providerId];
  const models = getModelsForProvider(providerId);

  const handleProviderChange = useCallback(
    (newProviderId: ProviderId) => {
      setProviderId(newProviderId);
      const newModels = getModelsForProvider(newProviderId);
      setModelId(newModels[0].id);
      setApiKey("");
      setError(null);
      setSaved(false);
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }
    if (!validateApiKeyFormat(providerId, apiKey.trim())) {
      setError(`API key should start with "${provider.apiKeyPrefix}"`);
      return;
    }
    setError(null);
    setSaved(true);
    onSave({ providerId, modelId, apiKey: apiKey.trim() });
  }, [providerId, modelId, apiKey, provider.apiKeyPrefix, onSave]);

  const handleClear = useCallback(() => {
    setApiKey("");
    setSaved(false);
    setError(null);
    onClear();
  }, [onClear]);

  const maskedKey = apiKey ? apiKey.slice(0, 8) + "•".repeat(Math.max(0, apiKey.length - 12)) + apiKey.slice(-4) : "";

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">AI Model Configuration</h3>
        {saved && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Connected
          </span>
        )}
      </div>

      {/* Provider Selection */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Provider</label>
        <div className="grid grid-cols-3 gap-2">
          {providerIds.map((id) => (
            <button
              key={id}
              onClick={() => handleProviderChange(id)}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                providerId === id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {AI_PROVIDERS[id].name}
            </button>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Model</label>
        <select
          value={modelId}
          onChange={(e) => {
            setModelId(e.target.value);
            setSaved(false);
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} — {model.capability}
            </option>
          ))}
        </select>
      </div>

      {/* API Key Input */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">API Key</label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError(null);
              setSaved(false);
            }}
            placeholder={provider.apiKeyPlaceholder}
            className={`w-full rounded-md border px-3 py-2 pr-20 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Your key is stored in session memory only — never persisted to disk.{" "}
          <a
            href={provider.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            Get an API key →
          </a>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saved ? "Update" : "Connect"}
        </button>
        {saved && (
          <button
            onClick={handleClear}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Current Config Summary */}
      {saved && (
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <p className="text-xs text-gray-600">
            <span className="font-medium">{provider.name}</span> · {models.find((m) => m.id === modelId)?.name} ·
            Key: {maskedKey}
          </p>
        </div>
      )}
    </div>
  );
}
