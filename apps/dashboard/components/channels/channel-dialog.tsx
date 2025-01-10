import React from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/utils/string";
import { cn } from "@/lib/utils";
import { API } from "@/api/axios";
import { useToast } from "@/hooks/use-toast";

interface ChannelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Channel) => void;
  initialData?: Channel;
  mode: 'add' | 'edit';
  channels: Channel[]
  submiting: boolean
}

export function ChannelDialog({ isOpen, onOpenChange, submiting, onSubmit, initialData, mode, channels }: ChannelDialogProps) {
  const { toast } = useToast();
  const [channel, setChannel] = React.useState<Channel>();

  const PlatformsData = [
    {
      value: `youtube`,
      label: 'YouTube',
    },
    {
      value: `twitch`,
      label: 'Twitch',
    },
    {
      value: `facebook`,
      label: 'Facebook',
    },
    {
      value: `instagram`,
      label: 'Instagram',
    },
    {
      value: `tiktok`,
      label: 'TikTok',
    },
  ]

  React.useEffect(() => {
    if (initialData) {
      setChannel(initialData);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    console.log('update channel', channel);
    if (channel?.platform && channel?.label && channel?.server && channel?.secret) {
      // const files = await checkStreamUrl(channel.platform);
      // if (files) {
      //   channel.files = files;
      // }
      onSubmit(channel);
      onOpenChange(false);
      // setChannel({ platform: '', server: '', secret: '', label: '', files: [] });
      setChannel(undefined);
    }
  };

  const handleDelete = async () => {
    try {
      API.delete(`/channels/${channel?.id}`);
      onOpenChange(false);
      setChannel(undefined);
      toast({
        title: "Success",
        description: "Channel deleted successfully."
      })
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete channel. Please try again."
      });
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1f2e] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Channel' : 'Edit Channel'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === 'add' ? 'Configure your new streaming channel here.' : 'Update your channel configuration here.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={channel?.platform}
              defaultValue={initialData?.platform}
              onValueChange={(value) => {
                // setChannel({ ...channel, platform: value, label: capitalizeFirstLetter(value.split('-')[1]) })
                setChannel({ ...channel, platform: value, label: capitalizeFirstLetter(value) })
              }}
            >
              <SelectTrigger className="bg-[#2a3142] border-gray-700">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a3142] border-gray-700">
                {PlatformsData.map((platform) => (
                  <SelectItem key={platform.value}
                    disabled={channels.some(c => c.platform === platform.value)}
                    value={platform.value}
                  >
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="server">Server URL</Label>
            <Input
              id="server"
              className="bg-[#2a3142] border-gray-700"
              value={channel?.server}
              onChange={(e) => setChannel({ ...channel, server: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secret">Stream Key</Label>
            <Input
              id="secret"
              type="password"
              className="bg-[#2a3142] border-gray-700"
              value={channel?.secret}
              onChange={(e) => setChannel({ ...channel, secret: e.target.value })}
            />
          </div>
        </div>
        <div className={cn("flex flex-row items-center justify-between")}>
          {mode === 'edit' && <Button
            disabled={submiting}
            variant="ghost"
            className="text-red-400"
            onClick={handleDelete}
          >
            Remove Channel
          </Button>}
          <Button type="submit" disabled={submiting} onClick={handleSubmit}>
            {mode === 'add' ? 'Add Channel' : 'Save Changes'}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
