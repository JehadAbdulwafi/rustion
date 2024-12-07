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
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { register } from "@/actions"

export function RegisterForm() {
  const [state, action] = useActionState(register, undefined)
  const { pending } = useFormStatus()

  return (
    <form action={action} className="w-full max-w-sm">
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
              {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
              {state?.errors?.other && <p className="text-red-500 text-sm">{state.errors.other}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              Register
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
