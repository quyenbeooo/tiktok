"use client";

import type { LoadingStep } from "@/types";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  step: LoadingStep;
}

const STEPS: LoadingStep[] = [
  "Đang lấy dữ liệu...",
  "Đang phân tích luồng video...",
  "Đang chuẩn bị liên kết tải xuống...",
  "Sắp hoàn tất...",
];

export default function LoadingState({ step }: LoadingStateProps) {
  const currentIndex = STEPS.indexOf(step);

  return (
    <div className="mx-auto w-full max-w-2xl animate-[fadeIn_0.5s_ease-out]">
      <div className="rounded-2xl border border-border bg-surface p-8">
        {/* Spinner */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-border" />
            <Loader2 className="absolute inset-0 m-auto h-16 w-16 animate-spin-slow text-neon-red" />
          </div>
          <p className="text-lg font-medium text-white">{step}</p>
        </div>

        {/* Progress steps */}
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                  i <= currentIndex
                    ? "bg-neon-cyan shadow-neon-cyan"
                    : "bg-border"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-500 ${
                  i <= currentIndex ? "text-white" : "text-muted/50"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Skeleton preview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="skeleton aspect-[9/16] w-full max-w-[200px] rounded-xl" />
          <div className="space-y-3">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton mt-4 h-10 w-full rounded-xl" />
            <div className="skeleton h-10 w-full rounded-xl" />
            <div className="skeleton h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
