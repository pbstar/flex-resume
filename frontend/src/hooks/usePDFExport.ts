import { useState, useCallback } from "react";
import type { AdaptedResume } from "../types";
import { exportPDF } from "../api";

export function usePDFExport(adaptedResume: AdaptedResume | null) {
  const [exporting, setExporting] = useState(false);

  const download = useCallback(
    async (html: string) => {
      setExporting(true);
      try {
        const blob = await exportPDF(html);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const name = adaptedResume?.basic?.name || "简历";
        a.download = `${name}_简历.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        setExporting(false);
      }
    },
    [adaptedResume],
  );

  return { exporting, download };
}
