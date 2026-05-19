export type Verdict = "PASS" | "FAIL" | "Blocked" | "Flaky";

export interface Pbi {
  title: string;
  ownerName: string;
  ownerNotionUserId?: string;
  notionUrl: string;
  figmaUrl?: string;
}

export interface VerdictOverride {
  verdict: Verdict;
  modifiedAt: string;
  modifiedBy: string;
}

export interface ReportSummary {
  sessionId: string;
  buildVersion: string;
  sheetName: string;
  createdAt: string;
  counts: { pass: number; fail: number; blocked: number; flaky: number };
  platform: "iOS" | "Android";
  slackThreadUrl: string;
  buildOwnerName?: string;
  pbi: Pbi;
}

export interface RowResult {
  no: number;
  tcId: string;
  title: string;
  category: string;
  group: string;
  subgroup: string;
  preconditions: string;
  stepsText: string;
  expected: string;
  verdict: Verdict;
  detail?: string[];
  userOverride?: VerdictOverride;
  artifacts: {
    screenshots: string[];
    video?: string;
    log?: string;
  };
}

export interface ReportDetail extends ReportSummary {
  categories: string[];
  rows: RowResult[];
}
