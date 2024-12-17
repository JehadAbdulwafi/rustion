"use client";

import { changePassword } from '@/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Key } from 'lucide-react'
import React, { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

export default function SecurityTab() {
  const [state, action] = useActionState(changePassword, undefined)
  const { pending } = useFormStatus()

  return (
    <form action={action}>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
                {state?.errors?.currentPassword && <p className="text-red-500 text-sm">{state.errors.currentPassword}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name='newPassword' type="password" required />
                {state?.errors?.newPassword && <p className="text-red-500 text-sm">{state.errors.newPassword}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPasswordConfirmation">Confirm New Password</Label>
                <Input id="newPasswordConfirmation" name="newPasswordConfirmation" type="password" required />
                {state?.errors?.newPasswordConfirmation && <p className="text-red-500 text-sm">{state.errors.newPasswordConfirmation}</p>}
              </div>
              <Button type="submit" disabled={pending}>
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <div className="flex items-center space-x-4">
              <Button disabled variant="outline">Enable 2FA</Button>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
