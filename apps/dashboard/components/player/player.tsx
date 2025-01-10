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
}: {
  stream?: Stream;
  onMetricsUpdate?: (metrics: StreamMetrics) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const [hasStreamError, setHasStreamError] = useState(false);

  const initPlayer = () => {
    if (!stream) {
      return;
    }
    if (!videoRef.current) {
      return;
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
        debug: true,
        startLevel: -1, // Let HLS.js choose the best quality
        autoStartLoad: true,
        capLevelToPlayerSize: true,
      });

      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(streamUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setHasStreamError(false);
        videoRef.current?.play();
        updateMetrics();
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        updateMetrics();
      });

      hls.on(Hls.Events.LEVEL_SWITCHING, (event, data) => {
        updateMetrics();
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
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
      videoRef.current.onloadeddata = () => {
        setHasStreamError(false);
      };
      videoRef.current.onerror = () => {
        setHasStreamError(true);
      };
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

    // Use the active level (either current or loading)
    const activeLevel = currentLevel !== -1 ? currentLevel : loadLevel;

    if (activeLevel === -1 || !hls.levels[activeLevel]) {
      return;
    }

    const level = hls.levels[activeLevel];
    const levelDetails = level?.details;

    // Get video element dimensions for actual resolution
    const videoWidth = videoRef.current.videoWidth || level.width;
    const videoHeight = videoRef.current.videoHeight || level.height;

    // Calculate bitrate - if level.bitrate is not available, try to get it from bandwidth
    let bitrate = 0;
    if (level.bitrate) {
      bitrate = Math.round(level.bitrate / 1000); // Convert to Kbps
    } else if (level.bandwidth) {
      bitrate = Math.round(level.bandwidth / 1000); // Convert to Kbps
    } else if (hls.bandwidthEstimate) {
      bitrate = Math.round(hls.bandwidthEstimate / 1000); // Use bandwidth estimate as fallback
    }

    const newMetrics: StreamMetrics = {
      resolution: `${videoWidth}x${videoHeight}`,
      bitrate,
      frameRate: level.frameRate || 30, // Use level frame rate or fallback to 30fps
      keyframeInterval: Math.round((levelDetails?.targetduration || 2) * 10) / 10, // Round to 1 decimal place
    };

    onMetricsUpdate?.(newMetrics);
  };

  const retryInitPlayer = () => {
    if (!hasStreamError) {
      return;
    }
    initPlayer();
  };

  useEffect(() => {
    initPlayer();

    // Set up metrics update interval
    const metricsInterval = setInterval(() => {
      updateMetrics();
    }, 5000); // Update every second

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      clearInterval(metricsInterval);
    };
  }, [stream]);

  useEffect(() => {
    if (hasStreamError) {
      const interval = setInterval(() => {
        retryInitPlayer();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [hasStreamError]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className={`w-full h-full ${hasStreamError ? 'hidden' : ''}`}
        autoPlay
        playsInline
        muted
        controls
      />
      {stream && hasStreamError && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center px-12">
          <SourceSetup stream={stream} />
        </div>
      )}
    </div>
  );
}
