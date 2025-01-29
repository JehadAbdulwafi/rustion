"use client";

import React from "react";
import { ChannelDialog } from "@/components/channels/channel-dialog";
import { ChannelItem } from "@/components/channels/channel-item";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusIcon } from "lucide-react";
import { API } from "@/api/axios";
import { useRouter } from "next/navigation";

export default function ChannelsScene({ channels }: { channels: Channel[] }) {
  const [submiting, setSubmiting] = React.useState(false);
  const [isAddingChannel, setIsAddingChannel] = React.useState(false);
  const [isEditingChannel, setIsEditingChannel] = React.useState(false);
  const [editingChannel, setEditingChannel] = React.useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const updateChannel = React.useCallback(async (
    id: string,
    platform: string,
    server: string,
    secret: string,
    enabled: boolean,
    custom: boolean,
    label: string
  ) => {
    if (!server?.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Server Address",
        description: "Please enter a valid server address for your channel configuration."
      });
      return;
    }

    if (custom && !label?.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Channel Label",
        description: "A descriptive label is required for custom channel configurations."
      });
      return;
    }

    try {
      setSubmiting(true);
      await API.put(`channels/${id}`, {
        platform,
        server: server.trim(),
        secret: secret || '',
        enabled,
        custom,
        label: label?.trim() || '',
      });

      router.refresh();
      toast({
        title: "Channel Updated",
        description: "Channel configuration has been successfully updated."
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.response?.data?.message || "Failed to update channel configuration. Please try again."
      });
    } finally {
      setTimeout(() => setSubmiting(false), 3000);
    }
  }, [setSubmiting, router]);

  const addChannel = React.useCallback(async (
    platform: string,
    server: string,
    secret: string,
    enabled: boolean,
    custom: boolean,
    label: string
  ) => {
    if (!server?.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Server Address",
        description: "Please enter a valid server address for your channel configuration."
      });
      return;
    }

    if (custom && !label?.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Channel Label",
        description: "A descriptive label is required for custom channel configurations."
      });
      return;
    }

    try {
      setSubmiting(true);
      await API.post('channels', {
        platform,
        server: server.trim(),
        secret: secret || '',
        enabled,
        custom,
        label: label?.trim() || '',
      });

      router.refresh();
      toast({
        title: "Channel Created",
        description: "New channel has been successfully created."
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error?.response?.data?.message || "Failed to create channel. Please try again."
      });
    } finally {
      setTimeout(() => setSubmiting(false), 3000);
    }
  }, [setSubmiting, router]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Channels</h1>
          <p className="text-sm text-muted-foreground">
            Configure your streaming channels here.
          </p>
        </div>
        <Button
          size={'sm'}
          disabled={submiting}
          onClick={() => {
            setIsAddingChannel(true);
            setIsEditingChannel(false);
            setEditingChannel(null);
          }}>
          <PlusIcon className="w-4 h-4" />
          Add Channel
        </Button>

      </div>
      <div className="space-y-4">
        {channels?.map((channel) => (
          <ChannelItem
            key={channel.platform}
            channel={channel}
            onEdit={(channel) => {
              setIsEditingChannel(true);
              setIsAddingChannel(false);
              setEditingChannel(channel);
            }}
            canToggle={false}
            submiting={submiting}
          />
        ))}
      </div>

      <ChannelDialog
        key={editingChannel ? editingChannel.id : 'add'}
        isOpen={isAddingChannel || isEditingChannel}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingChannel(false);
            setIsEditingChannel(false);
            setEditingChannel(null);
          }
        }}
        onSubmit={(conf) => {
          if (isAddingChannel) {
            addChannel(conf.platform, conf.server, conf.secret, false, true, conf.label);
          } else if (isEditingChannel) {
            updateChannel(conf.id, conf.platform, conf.server, conf.secret, false, true, conf.label);
          }
          setIsAddingChannel(false);
          setIsEditingChannel(false);
          setEditingChannel(null);
        }}
        submiting={submiting}
        channels={channels}
        initialData={editingChannel}
        mode={isAddingChannel ? 'add' : 'edit'}
      />
    </div>
  )
}
