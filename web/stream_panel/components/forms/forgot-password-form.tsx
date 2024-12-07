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
import { forgotPassword } from "@/actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPassword, undefined)
  const { pending } = useFormStatus()

  return (
    <form action={action}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
              {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              Reset Password
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Remembered?{" "}
            <Link href="/auth/" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
