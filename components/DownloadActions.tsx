"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Film,
  Music,
  ImageIcon,
  Loader2,
  Images,
} from "lucide-react";
import type { TikTokDownloadData } from "@/types";
import {
  forceDownload,
  downloadAllImages,
  formatDuration,
} from "@/lib/utils";
import VideoPreview from "./VideoPreview";
import ImageGallery from "./ImageGallery";

interface DownloadActionsProps {
  data: TikTokDownloadData;
  onToast: (message: string, type: "success" | "error") => void;
}

const SAVING_LABEL = "Đang lưu vào thiết bị...";

function DownloadButtonContent({
  isLoading,
  icon: Icon,
  label,
}: {
  isLoading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
        <span className="text-sm">{SAVING_LABEL}</span>
      </>
    );
  }

  return (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </>
  );
}

export default function DownloadActions({
  data,
  onToast,
}: DownloadActionsProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (
    url: string,
    filename: string,
    key: string
  ) => {
    if (!url) {
      onToast("Liên kết tải xuống không khả dụng", "error");
      return;
    }

    setDownloading(key);
    try {
      await forceDownload(url, filename);
      onToast(`Đã tải xuống ${filename}`, "success");
    } catch {
      onToast("Tải xuống thất bại. Vui lòng thử lại.", "error");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAllPhotos = async () => {
    setDownloading("all-photos");
    try {
      await downloadAllImages(data.images, data.author.username);
      onToast(`Đã tải xuống ${data.images.length} ảnh`, "success");
    } catch {
      onToast("Không thể tải ảnh. Vui lòng thử lại.", "error");
    } finally {
      setDownloading(null);
    }
  };

  const safeUsername = data.author.username.replace(/[^a-zA-Z0-9_-]/g, "");
  const timestamp = Date.now();

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {data.isSlideshow ? (
            <ImageGallery images={data.images} title={data.title} />
          ) : (
            <VideoPreview
              videoUrl={data.video.hd || data.video.sd}
              cover={data.cover}
              title={data.title}
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            {data.author.avatar && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-neon-red/30">
                <Image
                  src={data.author.avatar}
                  alt={data.author.nickname}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-white">
                {data.author.nickname}
              </p>
              <p className="text-sm text-neon-cyan">@{data.author.username}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold leading-snug text-white line-clamp-3">
              {data.title}
            </h2>
            {data.duration > 0 && (
              <p className="mt-1 text-sm text-muted">
                Thời lượng: {formatDuration(data.duration)}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            {data.isSlideshow ? (
              <>
                <button
                  onClick={handleDownloadAllPhotos}
                  disabled={downloading !== null}
                  className="btn-primary w-full"
                >
                  <DownloadButtonContent
                    isLoading={downloading === "all-photos"}
                    icon={Images}
                    label={`Tải tất cả ảnh (${data.images.length})`}
                  />
                </button>
                {data.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleDownload(
                        img,
                        `${safeUsername}_photo_${i + 1}.jpg`,
                        `photo-${i}`
                      )
                    }
                    disabled={downloading !== null}
                    className="btn-secondary w-full"
                  >
                    <DownloadButtonContent
                      isLoading={downloading === `photo-${i}`}
                      icon={ImageIcon}
                      label={`Tải ảnh ${i + 1}`}
                    />
                  </button>
                ))}
              </>
            ) : (
              <>
                {data.video.hd && (
                  <button
                    onClick={() =>
                      handleDownload(
                        data.video.hd,
                        `tiktok-video-${timestamp}.mp4`,
                        "hd"
                      )
                    }
                    disabled={downloading !== null}
                    className="btn-primary w-full"
                  >
                    <DownloadButtonContent
                      isLoading={downloading === "hd"}
                      icon={Download}
                      label="Tải video HD (không watermark)"
                    />
                  </button>
                )}

                {data.video.sd && (
                  <button
                    onClick={() =>
                      handleDownload(
                        data.video.sd,
                        `tiktok-original-${timestamp}.mp4`,
                        "sd"
                      )
                    }
                    disabled={downloading !== null}
                    className="btn-secondary w-full"
                  >
                    <DownloadButtonContent
                      isLoading={downloading === "sd"}
                      icon={Film}
                      label="Tải video gốc"
                    />
                  </button>
                )}

                {data.music && (
                  <button
                    onClick={() =>
                      handleDownload(
                        data.music,
                        `tiktok-audio-${timestamp}.mp3`,
                        "music"
                      )
                    }
                    disabled={downloading !== null}
                    className="btn-secondary w-full"
                  >
                    <DownloadButtonContent
                      isLoading={downloading === "music"}
                      icon={Music}
                      label="Tải audio (MP3)"
                    />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
