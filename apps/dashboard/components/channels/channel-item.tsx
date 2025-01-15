import React from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import Image from "next/image";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "@/utils/string";

interface ChannelItemProps {
  channel: {
    platform: string;
    label: string;
    enabled: boolean;
    start?: string;
    frame?: any;
    server: string;
    secret: string;
  };
  onEdit: (channel: any) => void;
  onToggle?: (enabled: boolean) => void;
  canToggle?: boolean;
  submiting: boolean
}

export function ChannelItem({ channel, onEdit, submiting, onToggle, canToggle }: ChannelItemProps) {
  const getPlatform = () => {
    if (channel.platform) {
      const platform = channel.platform?.split('-')?.[1]
      if (platform) {
        return platform
      }

      return channel.platform
    }
    return "UNKNOWN PLATFORM"
  }

  return (
    <div className="flex items-center justify-between p-2 sm:p-4  bg-[#2a3142] rounded-lg">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          <Image
            src={`/assets/icons/social/${getPlatform()}.svg`}
            alt={channel.platform}
            width={24}
            height={24}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{capitalizeFirstLetter(channel.label)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{channel.enabled ? ((channel.frame && channel.ready) ? 'Streaming' : 'Waiting') : 'Inactive'}</span>
            <span> • {channel.enabled && (channel.start && channel.ready) ? format(new Date(channel.start), 'HH:mm aa') : 'Not Started'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size={"sm"}
          className="text-gray-400 hover:text-white"
          onClick={() => onEdit(channel)}
        >
          Edit
        </Button>
        {canToggle && <Switch
          disabled={submiting}
          checked={channel.enabled}
          onCheckedChange={onToggle}
        />
        }
      </div>
    </div>
  );
}
