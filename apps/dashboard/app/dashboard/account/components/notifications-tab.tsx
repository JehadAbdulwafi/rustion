"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import React, { useState } from 'react'

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    discord: true
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications(prev => ({ ...prev, email: checked }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in your browser
            </p>
          </div>
          <Switch
            checked={notifications.push}
            onCheckedChange={(checked) =>
              setNotifications(prev => ({ ...prev, push: checked }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Discord Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications in Discord
            </p>
          </div>
          <Switch
            checked={notifications.discord}
            onCheckedChange={(checked) =>
              setNotifications(prev => ({ ...prev, discord: checked }))
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

