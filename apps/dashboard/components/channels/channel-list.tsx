import React from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

interface Channel {
  id: string;
  name: string;
  isPublic: boolean;
  isLive: boolean;
  lastLiveDate: string;
  isOffline: boolean;
}

export function ChannelList() {
  const [channels, setChannels] = React.useState<Channel[]>([
    {
      id: "1",
      name: "LY NARUTO",
      isPublic: true,
      isLive: true,
      lastLiveDate: "January 05",
      isOffline: true,
    },
    {
      id: "2",
      name: "jehad",
      isPublic: true,
      isLive: true,
      lastLiveDate: "January 05",
      isOffline: true,
    },
  ]);

  return (
    <div className="p-4 bg-[#1a1f2e] rounded-lg min-h-screen text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Channels</h2>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-[#2a3142] hover:bg-[#343b4d]">
              + Add Channel
            </Button>
            <Button variant="secondary" className="bg-[#2a3142] hover:bg-[#343b4d]">
              ✎ Update Titles
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>0 of 2 active Get More</span>
          <div className="flex items-center gap-2">
            <span>Toggle all</span>
            <span>OFF</span>
            <span>ON</span>
          </div>
        </div>

        <div className="space-y-2">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-4 bg-[#2a3142] rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{channel.name}</span>
                    <span className="text-xs text-gray-400">Public</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Live {channel.lastLiveDate}</span>
                    <span>• Offline</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Edit
                </Button>
                <Switch />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
