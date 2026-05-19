import type { ReportSummary } from "../../../lib/types";

export function ReportHeader({ r }: { r: ReportSummary }) {
  const platform = r.platform === "iOS" ? "🍎 iOS" : "🤖 Android";
  const date = r.createdAt ? r.createdAt.slice(0, 10) : "";
  return (
    <header className="report-header">
      <div className="os-badge">{platform}</div>
      <h1 className="report-title">{r.pbi?.title || r.sheetName}</h1>
      <div className="report-meta">
        <span>빌드: <strong>{r.buildVersion}</strong></span>
        {"   "}
        <span style={{ marginLeft: 16 }}>생성일: <strong>{date}</strong></span>
        {"   "}
        <span style={{ marginLeft: 16 }}>담당자: <strong>{r.pbi?.ownerName || "—"}</strong></span>
      </div>
      <div>
        <a className="link-btn" href={r.pbi?.notionUrl} target="_blank" rel="noreferrer">PBI 문서 ↗</a>
        <a className="link-btn" href={r.slackThreadUrl} target="_blank" rel="noreferrer">QA 슬랙 스레드 ↗</a>
        {r.pbi?.figmaUrl ? (
          <a className="link-btn" href={r.pbi.figmaUrl} target="_blank" rel="noreferrer">피그마 파일 ↗</a>
        ) : (
          <span className="link-btn" aria-disabled="true">피그마 파일 ↗</span>
        )}
      </div>
    </header>
  );
}
