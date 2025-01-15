"use client";
import Player from "@/components/player/player";
import StreamAnalytics from "@/components/player/stream-analytics";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { deleteStream } from "@/api/LiveApi";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import useStream from "@/hooks/use-stream";
import Channels from "@/components/channels/channels";
import { UpdateInfoDialog } from "../../components/update-info-dialog";

export default function LiveScene({ stream, userID, channels }: { stream: Stream, userID: string, channels: Channel[] }) {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const { streamStatus, setStreamStatus, setIsConnected } = useStream();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const [streamMetrics, setStreamMetrics] = useState({
    resolution: '',
    bitrate: 0,
    frameRate: 0,
    keyframeInterval: 0
  });

  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(
      `wss://server.jehad.ly/api/v1/streams/${stream.id}/ws?viewer_id=${userID}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("new event: ", data.payload);
      setStreamStatus(data.payload);
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = () => {
      wsRef.current = null;
      setTimeout(connect, 1000);
    };
  };

  const closeConnection = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    // Only connect if we don't have an active connection
    if (!wsRef.current) {
      connect();
    }

    return () => {
      closeConnection();
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteStream(stream.id);
      toast({
        title: "Success",
        description: "Stream has been deleted",
      });
      router.push("/dashboard/lives");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete stream",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/dashboard/lives">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 flex items-center gap-2">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">{stream?.name}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 col-span-3 lg:col-span-2 auto-rows-min">
          <div className="w-full aspect-video col-span-1 sm:col-span-3 rounded-xl bg-black">
            <Player onMetricsUpdate={setStreamMetrics} stream={stream} streamStatus={streamStatus} />
          </div>
          <div className="w-full col-span-1 sm:col-span-3">
            {streamStatus.status === "published" && (
              <StreamAnalytics
                metrics={streamMetrics}
                stream={stream}
                streamStatus={streamStatus}
              />
            )}
          </div>
        </div>
        <div className="lg:col-span-1 col-span-3 flex flex-col gap-4">
          <Channels stream={stream} channels={channels} />
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Stream"
        description="This action cannot be undone. This will permanently delete the stream and all its data."
        onConfirm={handleDelete}
      />

      <UpdateInfoDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        id={stream?.id}
        title={stream?.liveTitle}
        description={stream?.liveDescription}
        thumbnail={stream?.thumbnail}
      />
    </div>
  );
}
