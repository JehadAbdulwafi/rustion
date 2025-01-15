import React from "react";
import { Button } from "../ui/button";
import { API } from "@/api/axios";
import { useToast } from "@/hooks/use-toast";
import { ChannelDialog } from "./channel-dialog";
import { ChannelItem } from "./channel-item";
import { Card, CardContent, CardHeader } from "../ui/card";
import { PlusIcon } from "lucide-react";
import { useUser } from "@/contexts/user-context";

export default function Channels({ stream, channels }: { stream: Stream, channels: Channel[] }) {
  return <ChannelsImpl defaultSecrets={channels} stream={stream} />;
}

function ChannelsImpl({ defaultSecrets, stream }: { defaultSecrets?: Channel[], stream: Stream }) {
  const { user } = useUser();
  const [channels, setChannels] = React.useState<ForwardConfig[]>([]);
  const [submiting, setSubmiting] = React.useState(false);
  const [isAddingChannel, setIsAddingChannel] = React.useState(false);
  const [isEditingChannel, setIsEditingChannel] = React.useState(false);
  const [editingChannel, setEditingChannel] = React.useState<any>(null);
  const { toast } = useToast();

  const inputStream = `https://${stream.host}/${stream.app}/${stream.name}.m3u8`;

  React.useEffect(() => {
    if (!defaultSecrets) return;

    let index = 1;
    const confs = defaultSecrets?.map((secret) => {
      return {
        index: String(index++),
        allowCustom: true,
        ...secret,
        platform: `vlive-${secret.platform}-${user?.id}-${stream?.id}`,
        locale: {
          label: null, link: 'https://studio.youtube.com/channel/UC/livestreaming', link2: 'Go live',
          generate: (e: ForwardConfig) => {
            e.locale.label = e.custom ? 'custom' : 'youtube';
          },
        },
      };
    })

    // Regenerate the locale label, because it may change after created from defaults.
    confs.forEach((e) => {
      e?.locale?.generate && e.locale.generate(e);
    });
    setChannels(confs);
  }, [defaultSecrets, setChannels]);


  // Fetch the forwarding streams from server.
  React.useEffect(() => {
    const refreshStreams = () => {
      API.get('/streams/vlive/streams').then(res => {
        const data = res.data.data;
        // Update channels with new data for matching platforms
        if (!data) return;
        if (!channels) return;
        setChannels(prevConfigs => {
          const newConfigs = prevConfigs?.map(config => {
            const matchingStream = data.find((stream: ForwardStatus) => stream.platform === config.platform);
            if (matchingStream) {
              return {
                ...config,
                ...matchingStream,
                // Preserve existing config properties that shouldn't be overwritten
                label: config.label,
                locale: config.locale,
                allowCustom: config.allowCustom,
                index: config.index,
              };
            }
            return config;
          });
          return newConfigs;
        });


      }).catch(console.log);
    };

    refreshStreams();
    const timer = setInterval(() => refreshStreams(), 10000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleChannel = async (conf: ForwardConfig, enabled: boolean) => {
    const files = await checkStreamUrl(conf.platform);
    if (files) {
      conf.files = files;
    }
    updateSecrets('update', conf.platform, conf.server, conf.secret, enabled, true, conf.label, conf.files, () => {
      updateConfigObject({ ...conf, enabled: enabled });
    });
  };

  // Update config object in array.
  const updateConfigObject = React.useCallback((conf: ForwardConfig) => {
    const confs = channels.map((e) => {
      if (e.platform === conf.platform) {
        return conf;
      }
      return e;
    })
    setChannels(confs);
  }, [channels, setChannels]);

  // Update the vlive config to server.
  // @ts-ignore
  const updateSecrets = React.useCallback((action, platform, server, secret, enabled, custom, label, files, onSuccess) => {
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
      API.post('/streams/vlive/secrets', {
        action, platform, server, secret, enabled: !!enabled, custom: !!custom, label: `${label}-${user?.id}-${stream?.id}`, files,
      }).then(() => {
        toast({
          title: "Success",
          description: "Your forwarding configuration has been updated successfully."
        });
        onSuccess && onSuccess();
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update forwarding configuration. Please Publish the stream and try again."
        });
      });
    } finally {
      new Promise(resolve => setTimeout(resolve, 3000)).then(() => setSubmiting(false));
    }
  }, [setSubmiting]);


  const checkStreamUrl = React.useCallback(async (platform: string) => {
    if (!inputStream) return alert('plat.tool.stream3');
    const isHTTP = inputStream.startsWith('http://') || inputStream.startsWith('https://');
    if (!inputStream.startsWith('rtmp://') && !inputStream.startsWith('srt://') && !inputStream.startsWith('rtsp://') && !isHTTP) return alert(t('plat.tool.stream2'));
    if (isHTTP && inputStream.indexOf('.flv') < 0 && inputStream.indexOf('.m3u8') < 0) return alert('plat.tool.stream4');

    try {
      const res = await API.post(`/streams/vlive/stream-url`, {
        url: inputStream,
      });

      const streamObj = res.data.data;
      const files = [{ name: streamObj.name, size: 0, uuid: streamObj.uuid, target: streamObj.target, type: "stream" }];
      const ress = await API.post('/streams/vlive/source', {
        platform, files,
      });
      return ress.data.data.files
    } catch (e) {
      console.log(e)
    }
  }, [inputStream]);


  // @ts-ignore
  const updateChannel = React.useCallback((platform, server, secret, enabled, custom, label) => {
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
      });
    } finally {
      new Promise(resolve => setTimeout(resolve, 3000)).then(() => setSubmiting(false));
    }
  }, [setSubmiting]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Channels</h2>
            <div className="space-x-2">
              <Button
                size={'sm'}
                onClick={() => {
                  setIsAddingChannel(true);
                  setIsEditingChannel(false);
                  setEditingChannel(null);
                }}>
                <PlusIcon className="w-4 h-4" />
                Add Channel
              </Button>
            </div>
          </div>


        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {channels.map((channel) => (
              <ChannelItem
                key={channel.platform}
                channel={channel}
                onEdit={(channel) => {
                  setIsEditingChannel(true);
                  setIsAddingChannel(false);
                  setEditingChannel(channel);
                }}
                canToggle
                onToggle={(enabled) => handleToggleChannel(channel, enabled)}
                submiting={submiting}
              />
            ))}
          </div>
        </CardContent>
      </Card>

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
          updateChannel(conf.platform, conf.server, conf.secret, conf.enabled, true, conf.label);
        }}
        submiting={submiting}

        channels={defaultSecrets!}
        initialData={editingChannel}
        mode={isAddingChannel ? 'add' : 'edit'}
      />
    </div>
  );
}
