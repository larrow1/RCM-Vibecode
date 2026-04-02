"use client";

import { useState, useCallback, useEffect } from "react";
import { type AIConfig, type ProviderId, aiConfigSchema } from "../providers";

const STORAGE_KEY = "rcm-ai-config";

/**
 * React hook for managing AI configuration in the browser.
 *
 * Stores config in sessionStorage — cleared when the tab closes.
 * API keys never touch localStorage, cookies, or the server filesystem.
 */
export function useAIConfig() {
  const [config, setConfigState] = useState<AIConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = aiConfigSchema.safeParse(JSON.parse(stored));
        if (parsed.success) {
          setConfigState(parsed.data);
        }
      }
    } catch {
      // sessionStorage not available or corrupt data — start fresh
    }
    setIsLoaded(true);
  }, []);

  const setConfig = useCallback((newConfig: AIConfig) => {
    setConfigState(newConfig);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // sessionStorage full or not available — config still works in memory
    }
  }, []);

  const clearConfig = useCallback(() => {
    setConfigState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    config,
    setConfig,
    clearConfig,
    isConfigured: config !== null,
    isLoaded,
  };
}
