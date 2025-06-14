import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Fullscreen,
  Minimize2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { getFormatDuration } from "@/utils/formatUtils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const [isMuted, setMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetHideTimeout();
  }, []);

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration
    );
    video.currentTime = newTime;
    resetHideTimeout();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const value = Number(e.target.value);
    video.currentTime = (value / 100) * video.duration;
    resetHideTimeout();
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetHideTimeout = () => {
    setShowControls(true);
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 1200);
  };

  const handleInteraction = () => {
    resetHideTimeout();
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl aspect-video mx-auto bg-[#141414] dark:bg-[#252525]"
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain "
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={handleVideoEnd}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />

      {/* Buffering Overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-opacity-40">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Bottom controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-60 px-[1px] pb-2 flex flex-col space-y-2 bg-[#252525]/15">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className={
              "w-full accent-primary h-[4px] rounded-full cursor-pointer transition-all ease-in-out"
            }
          />
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => seek(-5)}
                className=" text-white"
              >
                <RotateCcw />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className=" text-white"
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => seek(5)}
                className=" text-white"
              >
                <RotateCw />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setMuted(videoRef.current?.muted);
                  }
                }}
                className=" text-white"
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
            </div>

            {/* Duration */}
            <div className="font-semibold text-sm px-2 text-white select-none">
              {getFormatDuration(currentTime)} / {getFormatDuration(duration)}
            </div>

            {/* Minimize/Maximize */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white"
            >
              {isFullscreen ? <Minimize2 /> : <Fullscreen />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
