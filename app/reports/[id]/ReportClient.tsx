"use client";
import { useState, useEffect } from "react";
import { ReportHeader } from "./ReportHeader";
import { ReportFilters } from "./ReportFilters";
import { ReportRow } from "./ReportRow";
import type { ReportDetail, RowResult, Verdict } from "../../../lib/types";

function overrideKey(sessionId: string, tcId: string) {
  return `qa-override:${sessionId}:${tcId}`;
}

function applyLocalOverrides(report: ReportDetail): ReportDetail {
  if (typeof window === "undefined") return report;
  return {
    ...report,
    rows: report.rows.map((r) => {
      const v = window.localStorage.getItem(overrideKey(report.sessionId, r.tcId));
      if (!v) return r;
      try {
        return { ...r, userOverride: JSON.parse(v) };
      } catch {
        return r;
      }
    }),
  };
}

export function ReportClient({ report: initial }: { report: ReportDetail }) {
  const [report, setReport] = useState<ReportDetail>(initial);
  const [filtered, setFiltered] = useState<RowResult[]>(initial.rows);

  useEffect(() => {
    const merged = applyLocalOverrides(initial);
    setReport(merged);
    setFiltered(merged.rows);
  }, [initial]);

  function handleOverride(tcId: string, verdict: Verdict) {
    const override = { verdict, modifiedAt: new Date().toISOString(), modifiedBy: "user" };
    window.localStorage.setItem(overrideKey(report.sessionId, tcId), JSON.stringify(override));
    const next: ReportDetail = {
      ...report,
      rows: report.rows.map((r) => (r.tcId === tcId ? { ...r, userOverride: override } : r)),
    };
    setReport(next);
  }

  return (
    <main>
      <ReportHeader r={report} />
      <ReportFilters
        rows={report.rows}
        categories={report.categories ?? []}
        onChange={setFiltered}
      />
      <div style={{ background: "#FFFFFF", border: "1px solid #E4E4E7", borderRadius: 12, padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 200px 140px 60px", gap: 12, padding: "12px 0", color: "#71717A", fontSize: 12, fontWeight: 600 }}>
          <span>TC ID</span><span>제목</span><span>구분</span><span>상태</span><span></span>
        </div>
        {filtered.map((row) => (
          <ReportRow key={row.tcId} row={row} reportId={report.sessionId} onOverride={handleOverride} />
        ))}
      </div>
    </main>
  );
}
