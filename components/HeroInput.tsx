"use client";

import { useState, useCallback } from "react";
import { Link2, ClipboardPaste, X, Download, Loader2 } from "lucide-react";
import { isValidTikTokUrl, sanitizeUrl, RATE_LIMIT_MESSAGE } from "@/lib/utils";
import type { AppState, LoadingStep, TikTokDownloadData } from "@/types";
import LoadingState from "./LoadingState";
import DownloadActions from "./DownloadActions";
import Toast from "./Toast";
import AdBanner from "./AdBanner";

const LOADING_STEPS: LoadingStep[] = [
  "Đang lấy dữ liệu...",
  "Đang phân tích luồng video...",
  "Đang chuẩn bị liên kết tải xuống...",
  "Sắp hoàn tất...",
];

export default function HeroInput() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(LOADING_STEPS[0]);
  const [result, setResult] = useState<TikTokDownloadData | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
    },
    []
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      showToast("Không thể truy cập clipboard", "error");
    }
  };

  const handleClear = () => {
    setUrl("");
    setState("idle");
    setResult(null);
  };

  const simulateLoadingSteps = () => {
    let stepIndex = 0;
    setLoadingStep(LOADING_STEPS[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < LOADING_STEPS.length) {
        setLoadingStep(LOADING_STEPS[stepIndex]);
      }
    }, 1200);

    return () => clearInterval(interval);
  };

  const handleDownload = async () => {
    const cleanUrl = sanitizeUrl(url);

    if (!cleanUrl) {
      showToast("Vui lòng nhập liên kết TikTok", "error");
      return;
    }

    if (!isValidTikTokUrl(cleanUrl)) {
      showToast(
        "Liên kết TikTok không hợp lệ. Vui lòng dán link từ tiktok.com, vm.tiktok.com hoặc vt.tiktok.com",
        "error"
      );
      return;
    }

    setState("loading");
    setResult(null);
    const clearSteps = simulateLoadingSteps();

    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(cleanUrl)}`
      );
      const json = await response.json();

      clearSteps();

      if (response.status === 429) {
        setState("error");
        showToast(json.error || RATE_LIMIT_MESSAGE, "error");
        return;
      }

      if (!json.success) {
        setState("error");
        showToast(json.error || "Không thể xử lý video", "error");
        return;
      }

      setResult(json.data);
      setState("success");
    } catch {
      clearSteps();
      setState("error");
      showToast("Lỗi mạng. Vui lòng kiểm tra kết nối internet.", "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleDownload();
  };

  return (
    <section className="w-full">
      {/* Hero text */}
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Download TikTok Videos{" "}
          <span className="gradient-text">Without Watermark</span>
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted sm:text-lg">
          Free, fast, and no registration required. Download HD videos, MP3
          audio, and photo slideshows instantly.
        </p>
      </div>

      {/* Input section */}
      <div className="mx-auto max-w-2xl">
        <div className="input-wrapper">
          <Link2 className="ml-2 h-5 w-5 shrink-0 text-neon-cyan" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Dán liên kết video TikTok vào đây..."
            className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-muted/60 focus:outline-none sm:text-base"
            aria-label="TikTok video URL"
            disabled={state === "loading"}
          />

          {url ? (
            <button
              onClick={handleClear}
              className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-white"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handlePaste}
              className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-neon-cyan"
              aria-label="Paste from clipboard"
            >
              <ClipboardPaste className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={state === "loading" || !url.trim()}
            className="btn-primary shrink-0 !rounded-xl !px-5 !py-2.5 sm:!px-8 sm:!py-3"
          >
            {state === "loading" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        {/* Supported formats hint */}
        <p className="mt-3 text-center text-xs text-muted/60">
          Hỗ trợ liên kết tiktok.com, vm.tiktok.com, vt.tiktok.com
        </p>

        <AdBanner />
      </div>

      {/* Loading state */}
      {state === "loading" && (
        <div className="mt-10">
          <LoadingState step={loadingStep} />
        </div>
      )}

      {/* Result section */}
      {state === "success" && result && (
        <div className="mt-10">
          <DownloadActions data={result} onToast={showToast} />
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
