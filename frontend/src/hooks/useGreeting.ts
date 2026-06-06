import { useState, useRef, useCallback } from "react";
import type { Greeting, GreetingConfig } from "../types";
import { generateGreeting } from "../api";

export function useGreeting() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (jd: string, companyIntro: string, config: GreetingConfig) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        const data = await generateGreeting(
          jd,
          companyIntro,
          config,
          abortRef.current.signal,
        );
        setGreetings(data.greetings || []);
        return data.greetings;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return null;
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setGreetings([]);
  }, []);

  return { greetings, setGreetings, loading, generate, clear };
}
