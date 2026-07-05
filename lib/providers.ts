import type { TikTokDownloadData } from "@/types";

export const API_TIMEOUT_MS = 5000;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type ProviderFetcher = (url: string) => Promise<TikTokDownloadData>;

interface ApiProvider {
  name: string;
  fetch: ProviderFetcher;
  /** Skip when env/config is missing (e.g. RapidAPI key). */
  enabled?: () => boolean;
}

/** Normalize heterogeneous API payloads into a single frontend shape. */
export function normalizeTikTokData(raw: Record<string, unknown>): TikTokDownloadData {
  const author = (raw.author as Record<string, string>) || {};
  const images = (raw.images as string[]) || [];

  return {
    title: (raw.title as string) || "TikTok Video",
    author: {
      username:
        author.unique_id || author.uniqueId || author.username || "unknown",
      nickname: author.nickname || "Unknown",
      avatar: author.avatar || author.avatar_thumb || "",
    },
    cover: (raw.cover as string) || (raw.origin_cover as string) || "",
    duration: Number(raw.duration) || 0,
    video: {
      hd:
        (raw.hdplay as string) ||
        (raw.hd as string) ||
        (raw.play as string) ||
        "",
      sd: (raw.play as string) || (raw.sdplay as string) || "",
      watermark: (raw.wmplay as string) || (raw.watermark as string) || "",
    },
    music: (raw.music as string) || (raw.music_info as string) || "",
    images,
    isSlideshow: images.length > 0,
  };
}

function hasValidMedia(data: TikTokDownloadData): boolean {
  return (
    data.isSlideshow || Boolean(data.video.hd || data.video.sd)
  );
}

async function fetchJson(
  input: string,
  init?: RequestInit
): Promise<Record<string, unknown>> {
  const response = await fetch(input, {
    ...init,
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  return response.json();
}

/** Primary: TikWM public API */
async function fetchTikWM(url: string): Promise<TikTokDownloadData> {
  const json = await fetchJson(
    `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
  );

  if (json.code !== 0 || !json.data) {
    throw new Error((json.msg as string) || "TikWM parse error");
  }

  const data = normalizeTikTokData(json.data as Record<string, unknown>);
  if (!hasValidMedia(data)) throw new Error("TikWM: no media streams");
  return data;
}

/** Secondary: RapidAPI (requires TIKTOK_API_KEY) */
async function fetchRapidAPI(url: string): Promise<TikTokDownloadData> {
  const apiKey = process.env.TIKTOK_API_KEY;
  if (!apiKey) throw new Error("RapidAPI not configured");

  const json = await fetchJson(
    `https://tiktok-video-no-watermark2.p.rapidapi.com/?url=${encodeURIComponent(url)}&hd=1`,
    {
      headers: {
        "x-rapidapi-host": "tiktok-video-no-watermark2.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
    }
  );

  const payload = (json.data || json) as Record<string, unknown>;
  const data = normalizeTikTokData(payload);
  if (!hasValidMedia(data)) throw new Error("RapidAPI: no media streams");
  return data;
}

/** Tertiary: Tiklydown free public API */
async function fetchTiklydown(url: string): Promise<TikTokDownloadData> {
  const json = await fetchJson(
    `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
  );

  const payload = (json.result || json.data || json) as Record<string, unknown>;
  const data = normalizeTikTokData(payload);
  if (!hasValidMedia(data)) throw new Error("Tiklydown: no media streams");
  return data;
}

/** Ordered failover chain — tries each provider until one succeeds. */
export const API_PROVIDERS: ApiProvider[] = [
  { name: "TikWM", fetch: fetchTikWM },
  {
    name: "RapidAPI",
    fetch: fetchRapidAPI,
    enabled: () => Boolean(process.env.TIKTOK_API_KEY),
  },
  { name: "Tiklydown", fetch: fetchTiklydown },
];

export async function fetchWithFailover(
  url: string
): Promise<{ data: TikTokDownloadData; provider: string }> {
  const errors: string[] = [];

  for (const provider of API_PROVIDERS) {
    if (provider.enabled && !provider.enabled()) continue;

    try {
      const data = await provider.fetch(url);
      return { data, provider: provider.name };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Unknown provider error";
      console.error(`[API Failover] ${provider.name} failed:`, msg);
      errors.push(`${provider.name}: ${msg}`);
    }
  }

  throw new Error(
    errors.length > 0
      ? `Tất cả nhà cung cấp đều thất bại (${errors.join("; ")})`
      : "Không có nhà cung cấp API khả dụng"
  );
}
