import Link from "next/link";
import { listReports } from "../../lib/storage";

export default function Reports() {
  const items = listReports();
  return (
    <main>
      <h1>QA Reports</h1>
      {items.length === 0 && <p>No reports yet.</p>}
      {items.map((r) => (
        <Link key={r.sessionId} href={`/reports/${r.sessionId}`} className="card">
          <div>
            <strong>{r.buildVersion}</strong> · {r.sheetName} · {r.createdAt}
          </div>
          <div className="counts">
            <span className="pass">✅ {r.counts.pass}</span>
            <span className="fail">❌ {r.counts.fail}</span>
            <span className="blocked">⏸ {r.counts.blocked}</span>
            <span className="flaky">⚠️ {r.counts.flaky}</span>
          </div>
        </Link>
      ))}
    </main>
  );
}
