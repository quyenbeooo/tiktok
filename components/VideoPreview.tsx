"use client";

import { useRef } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface VideoPreviewProps {
  videoUrl: string;
  cover: string;
  title: string;
}

export default function VideoPreview({
  videoUrl,
  cover,
  title,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-black mx-auto">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={cover}
        className="h-full w-full object-contain"
        loop
        muted={muted}
        playsInline
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Controls overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
        <button
          onClick={togglePlay}
          className="rounded-full bg-black/50 p-4 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? (
            <Pause className="h-8 w-8" fill="white" />
          ) : (
            <Play className="h-8 w-8" fill="white" />
          )}
        </button>
      </div>

      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {/* Hidden cover for SEO */}
      <Image
        src={cover}
        alt={title}
        width={1}
        height={1}
        className="sr-only"
        unoptimized
      />
    </div>
  );
}
