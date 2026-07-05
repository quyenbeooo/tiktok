/**
 * Validates and normalizes TikTok URLs.
 * Supports standard links, short links (vt/vm.tiktok.com), and mobile links.
 */
export function isValidTikTokUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
    /^https?:\/\/(www\.)?tiktok\.com\/t\/[\w-]+/i,
    /^https?:\/\/(vm|vt)\.tiktok\.com\/[\w-]+/i,
    /^https?:\/\/(www\.)?tiktok\.com\/[\w@.-]+\/video\/\d+/i,
    /^https?:\/\/m\.tiktok\.com\/v\/\d+/i,
  ];

  return patterns.some((pattern) => pattern.test(url.trim()));
}

export function sanitizeUrl(url: string): string {
  return url.trim().replace(/\s+/g, "");
}

function getExtension(filename: string, mimeType: string): string {
  if (filename.includes(".")) {
    return filename.slice(filename.lastIndexOf("."));
  }
  if (mimeType.includes("video")) return ".mp4";
  if (mimeType.includes("audio")) return ".mp3";
  if (mimeType.includes("image")) return ".jpg";
  return "";
}

/**
 * Force-download via Blob — prevents mobile browsers from opening a new tab.
 * Optimized for Safari iOS and Chrome Android.
 */
export async function forceDownload(
  url: string,
  filename?: string
): Promise<void> {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Không thể tải tệp để tải xuống");
  }

  const blob = await response.blob();
  const ext = getExtension(filename || "", blob.type);
  const finalName =
    filename || `tiktok-video-${Date.now()}${ext || ".mp4"}`;

  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = finalName;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup after click — required on mobile Safari
  requestAnimationFrame(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  });
}

/**
 * Download multiple images sequentially with delay to avoid browser blocking.
 */
export async function downloadAllImages(
  images: string[],
  username: string
): Promise<void> {
  const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, "user");

  for (let i = 0; i < images.length; i++) {
    await forceDownload(images[i], `${safeUsername}_photo_${i + 1}.jpg`);
    if (i < images.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Shared 429 message — kept in sync with server rate limiter. */
export const RATE_LIMIT_MESSAGE =
  "Quá nhiều yêu cầu. Vui lòng đợi 30 giây trước khi tải lại.";
