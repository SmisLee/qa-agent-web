import fs from "fs";
import path from "path";
import type { ReportSummary, ReportDetail } from "./types";

const ROOT = path.resolve(process.cwd(), "reports");
const INDEX_PATH = path.join(ROOT, "_index.json");

interface PbiIndexEntry {
  pbiId: string;
  title: string;
  lastRunAt: string;
  counts: { pass: number; fail: number; blocked: number; flaky: number };
}

interface PbiIndex {
  pbis: PbiIndexEntry[];
}

function loadIndex(): PbiIndex {
  if (!fs.existsSync(INDEX_PATH)) return { pbis: [] };
  return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
}

export function listReports(): ReportSummary[] {
  const idx = loadIndex();
  return idx.pbis.map((entry) => {
    const reportPath = path.join(ROOT, entry.pbiId, "report.json");
    if (!fs.existsSync(reportPath)) {
      return {
        sessionId: entry.pbiId,
        buildVersion: "unknown",
        sheetName: "unknown",
        createdAt: entry.lastRunAt,
        counts: entry.counts,
        platform: "iOS" as const,
        slackThreadUrl: "",
        pbi: { title: entry.title, ownerName: "", notionUrl: "" },
      };
    }
    const j = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    return {
      sessionId: entry.pbiId,
      buildVersion: j.buildVersion ?? "unknown",
      sheetName: j.sheetName ?? "unknown",
      createdAt: j.createdAt ?? entry.lastRunAt,
      counts: j.counts ?? entry.counts,
      platform: j.platform ?? "iOS",
      slackThreadUrl: j.slackThreadUrl ?? "",
      buildOwnerName: j.buildOwnerName,
      pbi: j.pbi ?? { title: entry.title, ownerName: "", notionUrl: "" },
    };
  });
}

function withBasePath(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const base = process.env.PAGES_BASE_PATH || "";
  if (!base) return url;
  if (url.startsWith("/artifacts/")) return base + url;
  return url;
}

function fixArtifactPaths(report: ReportDetail): ReportDetail {
  return {
    ...report,
    rows: report.rows.map((r) => {
      const fixed: any = {
        screenshots: (r.artifacts.screenshots || []).map((s) => withBasePath(s)!).filter(Boolean),
      };
      const v = withBasePath(r.artifacts.video);
      if (v) fixed.video = v;
      const l = withBasePath(r.artifacts.log);
      if (l) fixed.log = l;
      return { ...r, artifacts: fixed };
    }),
  };
}

export function readReport(pbiId: string): ReportDetail | null {
  const p = path.join(ROOT, pbiId, "report.json");
  if (!fs.existsSync(p)) return null;
  const j = JSON.parse(fs.readFileSync(p, "utf-8"));
  if (!j.categories && Array.isArray(j.rows)) {
    j.categories = Array.from(new Set(j.rows.map((r: any) => r.category).filter(Boolean)));
  }
  return fixArtifactPaths(j);
}
