"use client";

import * as React from "react";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  FileCheck2,
  X,
  Layers,
  BookOpen,
  Image as ImageIcon,
  Type as TypeIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreflightReport, PreflightIssue } from "@/lib/print/preflight";
import { useEditorStore } from "@/lib/editor/store";

interface PreflightModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: PreflightReport;
  onExportPrintPdf?: (options: { cropMarks: boolean }) => void;
  onExportCoverSpread?: () => void;
}

export function PreflightModal({
  isOpen,
  onClose,
  report,
  onExportPrintPdf,
  onExportCoverSpread,
}: PreflightModalProps) {
  const { setActivePage, selectElement } = useEditorStore();
  const [filter, setFilter] = React.useState<"all" | "warnings" | "info">("all");
  const [includeCropMarks, setIncludeCropMarks] = React.useState(true);

  if (!isOpen) return null;

  const filteredIssues = report.issues.filter((issue) => {
    if (filter === "warnings") return issue.severity === "error" || issue.severity === "warning";
    if (filter === "info") return issue.severity === "info";
    return true;
  });

  const handleJumpToIssue = (issue: PreflightIssue) => {
    setActivePage(issue.pageIndex);
    if (issue.elementId) {
      selectElement(issue.elementId, false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface text-text shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                report.errorsCount > 0
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                  : report.warningsCount > 0
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              }`}
            >
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-semibold tracking-tight text-text">
                  Pre-Flight Print Inspection
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
                    report.errorsCount > 0
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : report.warningsCount > 0
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {report.errorsCount > 0
                    ? "Action Needed"
                    : report.warningsCount > 0
                    ? "Printable with Warnings"
                    : "Press Ready (Passed)"}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Evaluates 3mm bleed, safe area margins, 300 DPI resolutions, and glyph sets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-text-muted hover:bg-accent-soft hover:text-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 border-b border-border bg-bg/40 p-4 text-center">
          <div className="rounded-xl border border-border bg-surface p-2.5 shadow-xs">
            <span className="block text-[10px] font-mono text-text-muted uppercase">Book Pages</span>
            <span className="font-serif text-lg font-bold text-text">{report.pageCount}</span>
          </div>
          <div className="rounded-xl border border-border bg-surface p-2.5 shadow-xs">
            <span className="block text-[10px] font-mono text-rose-600 uppercase">Errors</span>
            <span className="font-serif text-lg font-bold text-rose-700">{report.errorsCount}</span>
          </div>
          <div className="rounded-xl border border-border bg-surface p-2.5 shadow-xs">
            <span className="block text-[10px] font-mono text-amber-600 uppercase">Warnings</span>
            <span className="font-serif text-lg font-bold text-amber-700">{report.warningsCount}</span>
          </div>
          <div className="rounded-xl border border-border bg-surface p-2.5 shadow-xs">
            <span className="block text-[10px] font-mono text-emerald-600 uppercase">Ready Score</span>
            <span className="font-serif text-lg font-bold text-emerald-700">
              {report.errorsCount === 0 && report.warningsCount === 0 ? "100%" : report.errorsCount === 0 ? "94%" : "70%"}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-surface text-xs">
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === "all" ? "bg-accent text-white" : "text-text-muted hover:bg-accent-soft"
              }`}
            >
              All ({report.issues.length})
            </button>
            <button
              onClick={() => setFilter("warnings")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === "warnings" ? "bg-accent text-white" : "text-text-muted hover:bg-accent-soft"
              }`}
            >
              Warnings & Errors ({report.errorsCount + report.warningsCount})
            </button>
            <button
              onClick={() => setFilter("info")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === "info" ? "bg-accent text-white" : "text-text-muted hover:bg-accent-soft"
              }`}
            >
              Info / Glyphs ({report.infoCount})
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none text-text-muted hover:text-text">
            <input
              type="checkbox"
              checked={includeCropMarks}
              onChange={(e) => setIncludeCropMarks(e.target.checked)}
              className="rounded border-border text-accent focus:ring-accent h-3.5 w-3.5"
            />
            <span>Include Crop Marks in Print PDF</span>
          </label>
        </div>

        {/* Issues List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
              <h3 className="font-serif text-base font-semibold text-text">All Pre-Flight Checks Passed</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No low-resolution images, no elements outside the safe area, and all pages have valid print content.
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className={`rounded-xl border p-4 transition-all hover:shadow-xs flex gap-3.5 items-start ${
                  issue.severity === "error"
                    ? "border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/10"
                    : issue.severity === "warning"
                    ? "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/10"
                    : "border-sky-200 bg-sky-50/40 dark:border-sky-900/40 dark:bg-sky-950/10"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {issue.category === "low_res_image" ? (
                    <ImageIcon className="h-5 w-5 text-amber-600" />
                  ) : issue.category === "text_outside_safe_area" ? (
                    <TypeIcon className="h-5 w-5 text-amber-600" />
                  ) : issue.category === "empty_page" ? (
                    <Layers className="h-5 w-5 text-rose-600" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-sky-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-xs text-text">{issue.title}</span>
                    <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono border border-border text-text-muted">
                      {issue.pagePosition === 1 ? "Cover" : `Page ${issue.pagePosition}`}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{issue.message}</p>
                  {issue.suggestion && (
                    <p className="text-[11px] text-text/80 mt-1 font-mono italic">
                      💡 Tip: {issue.suggestion}
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleJumpToIssue(issue)}
                  className="shrink-0 h-7 text-[11px] gap-1 border-border bg-surface hover:bg-accent-soft"
                >
                  <span>Fix</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer with Export Buttons */}
        <div className="border-t border-border bg-surface px-6 py-4 flex items-center justify-between gap-3">
          <div className="text-[11px] text-text-muted">
            Generated with 3 mm bleed & spine geometry spec.
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onExportCoverSpread) onExportCoverSpread();
                else window.open(`/api/books/${report.bookId}/export?type=cover`, "_blank");
              }}
              className="text-xs gap-1.5 h-8.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              <span>Cover Spread PDF</span>
            </Button>

            <Button
              size="sm"
              onClick={() => {
                if (onExportPrintPdf) {
                  onExportPrintPdf({ cropMarks: includeCropMarks });
                } else {
                  window.open(
                    `/api/books/${report.bookId}/export?type=print&cropMarks=${includeCropMarks}&bleed=3`,
                    "_blank"
                  );
                }
              }}
              className="text-xs gap-1.5 h-8.5 bg-accent text-white hover:bg-neutral-800 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Generate Print PDF (3mm Bleed)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
