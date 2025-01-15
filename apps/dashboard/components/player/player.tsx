import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import SourceSetup from "../source-setup";

interface StreamMetrics {
  resolution: string;
  bitrate: number;
  frameRate: number;
  keyframeInterval: number;
}

export default function Player({
  stream,
  onMetricsUpdate,
  streamStatus,
}: {
  stream?: Stream;
  onMetricsUpdate?: (metrics: StreamMetrics) => void;
  streamStatus: { status: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasStreamError, setHasStreamError] = useState(false);

  const initPlayer = () => {
    if (streamStatus.status !== "published" || !stream || !videoRef.current) {
      return console.log("Stream not ready");
    }

    const streamUrl = `https://${stream.host}/${stream.app}/${stream.name}.m3u8`;
    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingMaxRetry: 10,
        manifestLoadingRetryDelay: 500,
        debug: false,
        startLevel: -1,
        autoStartLoad: true,
        capLevelToPlayerSize: true,
      });

      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(streamUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setHasStreamError(false);
        videoRef.current?.play();
        updateMetrics();
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        updateMetrics();
      });

      hls.on(Hls.Events.LEVEL_SWITCHING, () => {
        updateMetrics();
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        updateMetrics();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setHasStreamError(true);
        }
      });

      hlsRef.current = hls;
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
      videoRef.current.onloadeddata = () => setHasStreamError(false);
      videoRef.current.onerror = () => setHasStreamError(true);
    } else {
      setHasStreamError(true);
    }
  };

  const updateMetrics = () => {
    if (!videoRef.current || !hlsRef.current) {
      return;
    }

    const hls = hlsRef.current;
    const currentLevel = hls.currentLevel;
    const loadLevel = hls.loadLevel;
    const activeLevel = currentLevel !== -1 ? currentLevel : loadLevel;

    if (activeLevel === -1 || !hls.levels[activeLevel]) {
      return;
    }

    const level = hls.levels[activeLevel];
    const levelDetails = level?.details;

    const videoWidth = videoRef.current.videoWidth || level.width;
    const videoHeight = videoRef.current.videoHeight || level.height;

    let bitrate = 0;
    if (level.bitrate) {
      bitrate = Math.round(level.bitrate / 1000);
    } else if (level.bandwidth) {
      bitrate = Math.round(level.bandwidth / 1000);
    } else if (hls.bandwidthEstimate) {
      bitrate = Math.round(hls.bandwidthEstimate / 1000);
    }

    const newMetrics: StreamMetrics = {
      resolution: `${videoWidth}x${videoHeight}`,
      bitrate,
      frameRate: level.frameRate || 30,
      keyframeInterval: Math.round((levelDetails?.targetduration || 2) * 10) / 10,
    };

    onMetricsUpdate?.(newMetrics);
  };

  useEffect(() => {
    if (streamStatus.status === "published") {
      initPlayer();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamStatus.status]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {streamStatus.status === "published" ? (
        <video
          ref={videoRef}
          className={`w-full h-full`}
          autoPlay
          playsInline
          muted
          controls
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center px-12">
          <SourceSetup stream={stream!} />
        </div>
      )}
    </div>
  );
}
