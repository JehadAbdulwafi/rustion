"use client";
import Player from "@/components/player/player";
import SourceSetup from "@/components/source-setup";
import StatsCard from "@/components/stats-card";
import StreamInfo from "@/components/stream-info";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { deleteStream, updateStreamName } from "@/api/LiveApi";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { formatStreamDuration } from "@/utils/format-time";
import useStream from "@/hooks/use-stream";

export default function LiveScene({ stream, userID }: { stream: Stream, userID: string }) {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const { streamStatus, setStreamStatus, setIsConnected } = useStream();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(stream?.name || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(
      `ws://server.jehad.ly/api/v1/streams/${stream.id}/ws?viewer_id=${userID}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStreamStatus(data.payload);
      console.log("New message:", data);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
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

  const handleNameUpdate = async () => {
    try {
      await updateStreamName(stream.id, { name: newName });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Stream name has been updated",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stream name",
        variant: "destructive",
      });
    }
  };

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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/lives">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 flex items-center gap-2">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="max-w-[300px]"
              />
              <Button size={"sm"} onClick={handleNameUpdate}><Check className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size={"sm"} onClick={() => setIsEditing(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{stream?.name}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 col-span-1 lg:col-span-2 auto-rows-min">
          <div className="w-full aspect-video col-span-1 sm:col-span-3 rounded-xl bg-black">
            <Player streamStatus={streamStatus} />
          </div>

          <div className="w-full col-span-1 md:col-span-3 lg:col-span-1">
            <StatsCard
              title="Connection"
              value={streamStatus?.status === "published" ? "On Air" : "Off Air"}
            />
          </div>

          <div className="w-full col-span-1 md:col-span-3 lg:col-span-1">
            <StatsCard title="Total Viewers" value={streamStatus?.viewers || "-"} />
          </div>

          <div className="w-full col-span-1 md:col-span-3 lg:col-span-1">
            <StatsCard
              title="Stream Time"
              value={
                streamStatus?.status === "published"
                  ? formatStreamDuration(stream?.lastPublishedAt)
                  : "-"
              }
            />
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <SourceSetup stream={stream} />
          <StreamInfo
            id={stream?.id}
            title={stream?.liveTitle}
            description={stream?.liveDescription}
            thumbnail={stream?.thumbnail}
          />
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Stream"
        description="This action cannot be undone. This will permanently delete the stream and all its data."
        onConfirm={handleDelete}
      />
    </div>
  );
}
