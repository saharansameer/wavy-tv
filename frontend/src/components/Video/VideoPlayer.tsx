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

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const [isMuted, setMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

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

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[290px] md:h-[580px] aspect-square md:aspect-video bg-black mx-auto"
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-10  bg-opacity-40">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Bottom controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-60 px-2 py-1 flex flex-col space-y-2">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => seek(-5)}
                className="p-1"
              >
                <RotateCcw />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="p-1"
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => seek(5)}
                className="p-1"
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
                className="p-1"
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="p-1"
            >
              {isFullscreen ? <Minimize2 /> : <Fullscreen />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
