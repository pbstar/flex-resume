import { useState, useRef, useCallback } from "react";
import type { AdaptedResume, ResumeConfig } from "../types";
import { generateResume } from "../api";

export function useResume() {
  const [adaptedResume, setAdaptedResume] = useState<AdaptedResume | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (jd: string, config: ResumeConfig) => {
    // 取消上一次请求
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const data = await generateResume(jd, config, abortRef.current.signal);
      setAdaptedResume(data.adaptedResume);
      return data.adaptedResume;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return null;
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setAdaptedResume(null);
  }, []);

  return { adaptedResume, setAdaptedResume, loading, generate, clear };
}
