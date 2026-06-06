import { useState, useEffect, useCallback, useRef } from "react";
import type { HistoryEntry } from "../types";
import { getHistory, saveHistory } from "../api";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const load = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistory(data.entries || []);
    } catch {
      // 静默失败
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (type: "resume" | "greeting", jd: string, result: unknown) => {
      try {
        await saveHistory(type, jd, result);
        load();
      } catch {
        // 静默失败
      }
    },
    [load],
  );

  const toggle = useCallback(() => {
    if (showPanel) {
      // 关闭：先播放动画，再移除
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        setShowPanel(false);
        setClosing(false);
      }, 200);
    } else {
      setShowPanel(true);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    }
  }, [showPanel]);

  const close = useCallback(() => {
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setShowPanel(false);
      setClosing(false);
    }, 200);
  }, []);

  return { history, showPanel, closing, load, save, toggle, close };
}
