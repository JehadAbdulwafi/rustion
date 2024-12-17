"use client";

import { Podcast } from 'lucide-react';
import { getLiveStreams, createStream } from "@/api/LiveApi";
import { EmptyStateCard } from '@/components/empty-state-card';
import StreamCard from '@/components/stream-card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { catchErrorTyped } from '@/api/ApiError';

export default function LivesPage() {
  const [lives, setLives] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [streamName, setStreamName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchLives = async () => {
    setIsLoading(true);
    const [err, fetchedLives] = await catchErrorTyped(getLiveStreams());
    if (err !== undefined) {
      toast({
        title: "Error",
        description: "Failed to load streams",
        variant: "destructive",
      });
      setLives([])
    } else {
      setLives(fetchedLives);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLives();
  }, [toast]);

  const handleCreateStream = async () => {
    if (lives?.length > 0) {
      toast({
        title: "Stream Creation Failed",
        description: "You can only create one stream at a time.",
        variant: "destructive",
      });
      return;
    }

    if (!streamName.trim()) {
      toast({
        title: "Stream Creation Failed",
        description: "Please enter a stream name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    const [err] = await catchErrorTyped(createStream(streamName));
    if (err !== undefined) {
      toast({
        title: "Stream Creation Failed",
        description: "An error occurred while creating the stream.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Stream created successfully.",
      });

      fetchLives();
      setIsCreating(false);
      setDialogOpen(false);
      setStreamName('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">Loading streams...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Streams</h1>
        <p className="text-sm text-muted-foreground">View all of the lives you're part of in one place</p>
      </div>
      {lives?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {lives.map((live) => (
            <StreamCard key={live.id} live={live} />
          ))}
        </div>
      ) : (
        <>
          <EmptyStateCard
            title="No lives"
            description="Create your first stream to get started."
            icon={Podcast}
            actionLabel='Create Live'
            onActionClick={() => setDialogOpen(true)}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Stream</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Stream Name</Label>
                  <Input
                    id="name"
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value)}
                    placeholder="Enter stream name"
                  />
                </div>
                <Button onClick={handleCreateStream} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Stream"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
