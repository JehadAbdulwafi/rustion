import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Users, Clock, Monitor, Signal, Gauge, RefreshCw } from 'lucide-react';

interface StreamMetrics {
  resolution: string;
  bitrate: number;
  frameRate: number;
  keyframeInterval: number;
}

interface StreamAnalyticsProps {
  metrics: StreamMetrics;
  stream: Stream;
  streamStatus: StreamStatus;
}

export default function StreamAnalytics({ metrics, stream, streamStatus }: StreamAnalyticsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-900/80 rounded-lg">
      <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors">
        <Users className="w-4 h-4 text-blue-400" />
        <div>
          <span className="text-xs font-medium text-gray-400">Viewers</span>
          <p className="text-sm font-semibold text-gray-200">{streamStatus?.viewers || 0}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors">
        <Clock className="w-4 h-4 text-green-400" />
        <div>
          <span className="text-xs font-medium text-gray-400">Live for</span>
          <p className="text-sm font-semibold text-gray-200">
            {stream.lastPublishedAt ? formatDistanceToNow(new Date(stream.lastPublishedAt)) : '-'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors">
        <Monitor className="w-4 h-4 text-purple-400" />
        <div>
          <span className="text-xs font-medium text-gray-400">Resolution</span>
          <p className="text-sm font-semibold text-gray-200">{metrics.resolution}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors">
        <Signal className="w-4 h-4 text-yellow-400" />
        <div>
          <span className="text-xs font-medium text-gray-400">Bitrate</span>
          <p className="text-sm font-semibold text-gray-200">{metrics.bitrate} Kbps</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors">
        <Gauge className="w-4 h-4 text-red-400" />
        <div>
          <span className="text-xs font-medium text-gray-400">Frame rate</span>
          <p className="text-sm font-semibold text-gray-200">{metrics.frameRate} fps</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-colors">
        <RefreshCw className="w-4 h-4 text-orange-400" />
        <div>
          <span className="text-xs font-medium text-gray-400">Keyframe</span>
          <p className="text-sm font-semibold text-gray-200">{metrics.keyframeInterval}s</p>
        </div>
      </div>
    </div>
  );
}
