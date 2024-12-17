"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordComplete } from "@/actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export function ForgotPasswordCompleteForm() {
  const [state, action] = useActionState(forgotPasswordComplete, undefined)
  const { pending } = useFormStatus()

  return (
    <form action={action}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset your Password</CardTitle>
          <CardDescription>
            Enter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Input
                id="tokem"
                name="token"
                placeholder="xy544wxg..."
                required
              />
              {state?.errors?.token && <p className="text-red-500 text-sm">{state.errors.token}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your new password"
                required
              />
              {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              Reset Password
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Haven't received a token?{" "}
            <Link href="/auth/forgot-password" className="underline">
              Request a new one
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
