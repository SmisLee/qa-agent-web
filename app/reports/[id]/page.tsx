import { readReport, listReports } from "../../../lib/storage";
import { notFound } from "next/navigation";
import { ReportClient } from "./ReportClient";

export function generateStaticParams() {
  return listReports().map((r) => ({ id: r.sessionId }));
}

export const dynamicParams = false;

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = readReport(id);
  if (!report) return notFound();
  return <ReportClient report={report} />;
}
