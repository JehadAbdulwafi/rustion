"use client";

import React from "react";
import { ChannelDialog } from "@/components/channels/channel-dialog";
import { ChannelItem } from "@/components/channels/channel-item";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusIcon } from "lucide-react";
import { API } from "@/api/axios";

export default function page() {
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [submiting, setSubmiting] = React.useState(false);
  const [isAddingChannel, setIsAddingChannel] = React.useState(false);
  const [isEditingChannel, setIsEditingChannel] = React.useState(false);
  const [editingChannel, setEditingChannel] = React.useState<any>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const refreshStreams = () => {
      API.get('channels').then(res => {
        const data = res.data;
        if (!data) return setChannels([]);
        setChannels(data);

      }).catch(console.log);
    };

    refreshStreams();
  }, []);

  // @ts-ignore
  const updateSecrets = React.useCallback((platform, server, secret, enabled, custom, label) => {
    console.log(`Forward: Update secrets ${JSON.stringify({ platform, server, secret, enabled, custom, label })}`);
    if (!server) {
      toast({
        variant: "destructive",
        title: "Server Address Required",
        description: "Please enter a valid server address to continue."
      });
      return;
    }

    if (custom && !label) {
      toast({
        variant: "destructive",
        title: "Label Required",
        description: "Please provide a label for your custom configuration."
      });
      return;
    }

    try {
      setSubmiting(true);
      API.post('channels', {
        platform, server, secret, enabled: !!enabled, custom: !!custom, label,
      }).then(() => {
        toast({
          title: "Success",
          description: "Your forwarding configuration has been updated successfully."
        });
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update forwarding configuration. Please try again."
        });
        console.log(error);
      });
    } finally {
      new Promise(resolve => setTimeout(resolve, 3000)).then(() => setSubmiting(false));
    }
  }, [setSubmiting]);

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
        isOpen={isAddingChannel || isEditingChannel}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingChannel(false);
            setIsEditingChannel(false);
            setEditingChannel(null);
          }
        }}
        onSubmit={(conf) => {
          updateSecrets(conf.platform, conf.server, conf.secret, conf.enabled, true, conf.label);
        }}
        submiting={submiting}
        channels={channels}
        initialData={editingChannel}
        mode={isAddingChannel ? 'add' : 'edit'}
      />
    </div>
  )
}

