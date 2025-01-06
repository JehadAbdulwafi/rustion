import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "@/components/ui/input"
import { API } from "@/api/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import Link from "next/link";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Clock, Gauge, HardDrive } from "lucide-react";

export default function Forward() {
  const [init, setInit] = React.useState(false);
  const [secrets, setSecrets] = React.useState<ForwardConfigMap>();

  React.useEffect(() => {
    API.get('/streams/forward/secrets').then(res => {
      const secrets = res.data.data;
      setInit(true);
      setSecrets(secrets || {});
      // console.log(`Forward: Secret query ok ${JSON.stringify(secrets)}`);
    }).catch(console.log);
  }, []);

  if (!init) return <div className="flex flex-1 flex-col gap-4">
    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
  </div>;
  return <ScenarioForwardImpl defaultSecrets={secrets} />;
}

function ScenarioForwardImpl({ defaultSecrets }: { defaultSecrets?: ForwardConfigMap }) {

  const [configs, setConfigs] = React.useState<ConfigsState>([]);
  const [forwards, setForwards] = React.useState<StreamResponse>();
  const [submiting, setSubmiting] = React.useState<boolean>();
  const { toast } = useToast();

  // Convert default config from kv to objects in array.
  React.useEffect(() => {
    if (!defaultSecrets) return;

    let index = 1;
    const confs = [{
      platform: 'wx', enabled: false, index: String(index++), allowCustom: true,
      ...defaultSecrets?.wx,
      label: 'YouTube',
      locale: {
        label: null, link: 'https://studio.youtube.com/channel/UC/livestreaming', link2: 'Go live',
        generate: (e) => {
          e.locale.label = e.custom ? 'custom' : 'youtube';
        },
      },
    }, {
      platform: 'bilibili', enabled: false, index: String(index++), allowCustom: true,
      ...defaultSecrets?.bilibili,
      label: 'Twitch',
      locale: {
        label: null, link: 'https://www.twitch.tv/dashboard/settings', link2: 'Dashboard',
        generate: (e) => {
          e.locale.label = e.custom ? 'custom' : 'twitch';
        },
      },
    }, {
      platform: 'kuaishou', enabled: false, index: String(index++), allowCustom: true, custom: false,
      ...defaultSecrets?.kuaishou,
      label: 'Facebook',
      locale: {
        label: null, link: 'https://www.facebook.com/live/producer?ref=OBS', link2: 'Live Producer',
        generate: (e) => {
          e.locale.label = e.custom ? 'custom' : 'facebook';
        },
      },
    }];

    // Regenerate the locale label, because it may change after created from defaults.
    confs.forEach((e) => {
      e?.locale?.generate && e.locale.generate(e);
    });

    // Generate more forwarding configures.
    while (confs.length < 5) {
      const rindex = index++;
      const rid = Math.random().toString(16).slice(-6);

      // Load the configured forwarding from defaults.
      const existsConf = Object.values(defaultSecrets).find(e => e.platform.indexOf(`forwarding-${rindex}-`) === 0);
      if (existsConf) {
        confs.push(existsConf);
      } else {
        confs.push({
          platform: `forwarding-${rindex}-${rid}`, enabled: false, index: String(rindex), allowCustom: false,
          server: null, secret: null, custom: true, label: `Forwarding #${rindex}`,
        });
      }
    }

    setConfigs(confs);
    // console.log(`Forward: Init configs ${JSON.stringify(confs)}`);
  }, [defaultSecrets, setConfigs]);

  // Fetch the forwarding streams from server.
  React.useEffect(() => {
    const refreshStreams = () => {
      API.get('/streams/forward/streams').then(res => {
        setForwards(res.data.data.map((e: StreamElement, i: number) => ({
          ...e,
          name: {
            wx: 'youtube',
            bilibili: 'twitch',
            kuaishou: 'facebook'
          }[e.platform],
          start: e.start ? e.start : null,
          ready: e.ready ? e.ready : null,
          update: e.frame?.update ? e.frame.update : null,
          i,
        })));
        // console.log(`Forward: Query streams ${JSON.stringify(res.data.data)}`);
      }).catch(console.log);
    };

    refreshStreams();
    const timer = setInterval(() => refreshStreams(), 10 * 1000);
    return () => clearInterval(timer);
  }, [setForwards]);

  // Update config object in array.
  const updateConfigObject = React.useCallback((conf: Config) => {
    const confs = configs.map((e) => {
      if (e.platform === conf.platform) {
        return conf;
      }
      return e;
    })
    setConfigs(confs);
    // console.log(`Forward: Update config ${JSON.stringify(conf)} to ${JSON.stringify(confs)}`);
  }, [configs, setConfigs]);

  // Update the forward config to server.
  // @ts-ignore
  const updateSecrets = React.useCallback((e, action, platform, server, secret, enabled, custom, label, onSuccess) => {
    // console.log(`Forward: Update secrets ${JSON.stringify({ action, platform, server, secret, enabled, custom, label })}`);
    e.preventDefault();

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
      API.post('/streams/forward/secrets', {
        action, platform, server, secret, enabled: !!enabled, custom: !!custom, label,
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
          description: "Failed to update forwarding configuration. Please try again."
        });
        console.log(error);
      });
    } finally {
      new Promise(resolve => setTimeout(resolve, 3000)).then(() => setSubmiting(false));
    }
  }, [setSubmiting]);

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Stream Forwarding Status</CardTitle>
          <CardDescription>
            Monitor your active stream forwarding connections and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            forwards?.length ? (
              <Table>
                <TableCaption>Active Stream Forwarding Connections</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Connection Status</TableHead>
                    <TableHead>Started At</TableHead>
                    <TableHead>Connected At</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Source Stream</TableHead>
                    <TableHead className="text-right">Status Log</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                </TableBody>
                <tbody>
                  {
                    forwards?.map(file => {
                      return <TableRow key={file.platform}>
                        <TableCell>{file.i}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/assets/icons/social/${file.platform}.svg`}
                              alt={file.platform}
                              width={20}
                              height={20}
                            />
                            {file.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={file.enabled ? (file.frame ? 'success' : 'default') : 'secondary'}>
                            {file.enabled ? (file.frame ? 'Streaming' : 'Waiting') : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{file.start && format(new Date(file.start), 'HH:mm:ss')}</TableCell>
                        <TableCell>{file.ready && format(new Date(file.ready), 'HH:mm:ss')}</TableCell>
                        <TableCell>{file.update && format(new Date(file.update), 'HH:mm:ss')}</TableCell>
                        <TableCell className="font-mono text-sm">{file.stream}</TableCell>
                        <TableCell className="text-right">
                          {file.frame?.log && (
                            <div className="flex items-center justify-end gap-3">
                              {(() => {
                                const logParts = file.frame.log.split(' ');
                                const speed = logParts.find(part => part.startsWith('speed='))?.split('=')[1];
                                const time = logParts.find(part => part.startsWith('time='))?.split('=')[1];
                                const size = logParts.find(part => part.startsWith('size='))?.split('=')[1];

                                return (
                                  <>
                                    {time && (
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{time}</span>
                                      </div>
                                    )}
                                    {size && (
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <HardDrive className="h-4 w-4" />
                                        <span>{size}</span>
                                      </div>
                                    )}
                                    {speed && (
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Gauge className="h-3 w-3" />
                                        <span>{speed}</span>
                                      </Badge>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>

                    })
                  }
                </tbody>
              </Table>
            ) : ''
          }
          {!forwards?.length ? 'No forwarding' : ''}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {configs.map((conf) => {
          return (
            <Card key={conf.platform}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image
                    src={`/assets/icons/social/${conf.platform}.svg`}
                    alt={conf.platform}
                    width={36}
                    height={36}
                    className="mr-2 inline"
                  />
                  {conf.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="gap-4 flex flex-col">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <Label className="mr-2">Server</Label>
                      {!conf.custom &&
                        <span className="text-sm text-gray-500">
                          *{'Visit '}
                          <Link href={conf?.locale?.link} className="text-blue-500 underline" target='_blank' rel='noreferrer'>{conf?.locale?.link2}</Link>
                          {' to get your Stream URL'}
                        </span>
                      }
                    </div>
                    <Input defaultValue={conf.server} onChange={(e) => updateConfigObject({ ...conf, server: e.target.value })} />

                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <Label className="mr-2">Secret</Label>
                      {!conf.custom &&
                        <span className="text-sm text-gray-500">
                          *{'Visit '}
                          <Link href={conf?.locale?.link} className="text-blue-500 underline" target='_blank' rel='noreferrer'>{conf?.locale?.link2}</Link>
                          {' to get your Stream Key'}
                        </span>
                      }
                    </div>
                    <Input defaultValue={conf.secret} onChange={(e) => updateConfigObject({ ...conf, secret: e.target.value })} />
                  </div>

                  <div className="">
                    <Button
                      type="submit"
                      disabled={submiting}
                      className="mr-2 px-4 py-1 text-sm font-medium"
                      variant={conf.enabled ? 'destructive' : 'default'}
                      onClick={(e) => {
                        updateSecrets(e, 'update', conf.platform, conf.server, conf.secret, !conf.enabled, conf.custom, conf.label, () => {
                          updateConfigObject({ ...conf, enabled: !conf.enabled });
                        });
                      }}
                    >
                      {conf.enabled ? 'Stop' : 'Start'}
                    </Button>
                    <span className="text-sm text-gray-500">*If multiple streams are available, one will be selected at random.</span>

                  </div>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
