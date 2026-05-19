"use client";
import { useState, useMemo, useEffect } from "react";
import type { RowResult } from "../../../lib/types";

type Tab = "all" | "pass" | "fail";

export function ReportFilters({
  rows, categories, onChange,
}: {
  rows: RowResult[];
  categories: string[];
  onChange: (filtered: RowResult[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [category, setCategory] = useState<string>("");

  const counts = useMemo(() => {
    const c = { all: rows.length, pass: 0, fail: 0 };
    for (const r of rows) {
      const v = r.userOverride?.verdict ?? r.verdict;
      if (v === "PASS") c.pass++;
      else c.fail++;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const v = r.userOverride?.verdict ?? r.verdict;
      if (tab === "pass" && v !== "PASS") return false;
      if (tab === "fail" && v === "PASS") return false;
      if (category && r.category !== category) return false;
      return true;
    });
  }, [rows, tab, category]);

  useEffect(() => { onChange(filtered); }, [filtered, onChange]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "16px 0", justifyContent: "flex-end" }}>
      <TabBtn active={tab === "all"} onClick={() => setTab("all")}>전체 ({counts.all})</TabBtn>
      <TabBtn active={tab === "pass"} onClick={() => setTab("pass")}>성공 ({counts.pass})</TabBtn>
      <TabBtn active={tab === "fail"} onClick={() => setTab("fail")}>실패 ({counts.fail})</TabBtn>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E4E4E7", background: "#FFFFFF", fontSize: 14 }}
      >
        <option value="">카테고리 (전체)</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 8, border: "1px solid #E4E4E7",
        background: active ? "#09090B" : "#FFFFFF",
        color: active ? "#FAFAFA" : "#09090B",
        fontWeight: active ? 600 : 400, cursor: "pointer", fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}
