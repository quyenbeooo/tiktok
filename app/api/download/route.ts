import { NextRequest, NextResponse } from "next/server";
import { isValidTikTokUrl, sanitizeUrl } from "@/lib/utils";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_ERROR,
} from "@/lib/rate-limit";
import { fetchWithFailover } from "@/lib/providers";
import type { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: RATE_LIMIT_ERROR },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds || 30),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get("url");

    if (!rawUrl) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Thiếu tham số URL TikTok" },
        { status: 400 }
      );
    }

    const url = sanitizeUrl(rawUrl);

    if (!isValidTikTokUrl(url)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Liên kết TikTok không hợp lệ. Vui lòng dùng link từ tiktok.com, vm.tiktok.com hoặc vt.tiktok.com",
        },
        { status: 400 }
      );
    }

    const { data, provider } = await fetchWithFailover(url);
    console.info(`[Download API] Success via ${provider} for IP ${clientIp}`);

    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch (error) {
    console.error("[Download API] error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Đã xảy ra lỗi không mong muốn khi xử lý video";

    if (
      message.includes("timeout") ||
      message.includes("aborted") ||
      message.includes("AbortError")
    ) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Yêu cầu hết thời gian chờ. Vui lòng thử lại." },
        { status: 504 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
