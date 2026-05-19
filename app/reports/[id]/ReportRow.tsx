"use client";
import { useState, useRef } from "react";
import type { RowResult, Verdict } from "../../../lib/types";

function VideoWithSlider({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const fmt = (s: number) => {
    const m = Math.floor(s / 60); const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };
  return (
    <div>
      <video
        ref={ref}
        src={src}
        controls
        preload="metadata"
        style={{ width: "100%", display: "block" }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
      />
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={time}
        onChange={(e) => {
          const v = ref.current; if (!v) return;
          v.currentTime = parseFloat(e.target.value);
        }}
        style={{ width: "100%", marginTop: 6, accentColor: "#FC314C" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#71717A" }}>
        <span>{fmt(time)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}

const VERDICTS: Verdict[] = ["PASS", "FAIL", "Blocked", "Flaky"];

export function ReportRow({
  row, reportId, onOverride,
}: {
  row: RowResult;
  reportId: string;
  onOverride: (tcId: string, verdict: Verdict) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const effective: Verdict = row.userOverride?.verdict ?? row.verdict;

  function changeVerdict(v: Verdict) {
    setEditing(false);
    onOverride(row.tcId, v);
  }

  return (
    <div style={{ borderTop: "1px solid #E4E4E7", padding: "16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 200px 140px 60px", gap: 12, alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", color: "#71717A", fontSize: 13 }}>{row.tcId}</span>
        <span style={{ fontWeight: 500 }}>{row.title}</span>
        <span style={{ color: "#71717A", fontSize: 13 }}>{row.category}</span>
        <span>
          {editing ? (
            <select
              autoFocus
              onChange={(e) => changeVerdict(e.target.value as Verdict)}
              onBlur={() => setEditing(false)}
              defaultValue={effective}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E4E4E7" }}
            >
              {VERDICTS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className={`badge ${effective.toLowerCase()}`}
              style={{ border: "none", cursor: "pointer" }}
              title="클릭해서 수정"
            >
              {effective}
              {row.userOverride ? <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7 }}>· 수정됨</span> : null}
            </button>
          )}
        </span>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "1px solid #E4E4E7", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}
          aria-label="펼치기"
        >
          {open ? "▲" : "▼"}
        </button>
      </div>
      {open && (
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <ArtifactCell label="영상">
            {row.artifacts.video ? (
              <VideoWithSlider src={row.artifacts.video} />
            ) : (
              <Placeholder>영상 없음</Placeholder>
            )}
          </ArtifactCell>
          {(row.artifacts.screenshots ?? []).map((s, i) => (
            <ArtifactCell key={i} label={`스크린샷 ${i + 1}`}>
              <img src={s} alt="" style={{ width: "100%" }} />
            </ArtifactCell>
          ))}
        </div>
      )}
    </div>
  );
}

function ArtifactCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#F4F4F5", borderRadius: 8, padding: 12, minHeight: 200 }}>
      <div style={{ fontSize: 12, color: "#71717A", marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "#A1A1AA", fontSize: 13, padding: 24, textAlign: "center" }}>{children}</div>;
}
