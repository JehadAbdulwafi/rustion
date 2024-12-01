import { API } from '@/api/axios'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .trim(),
})

export type LoginFormState =
  | {
    errors?: {
      email?: string[]
      password?: string[]
      other?: string[]
    }
    message?: string
  }
  | undefined


type LoginValidateError = {
  email?: string[] | undefined;
  password?: string[] | undefined;
  other?: string[] | undefined;
}

export async function login(state: LoginFormState, formData: FormData) {
  let redirectPath: string | null = null
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as LoginValidateError,
    }
  }

  try {
    const res = await API.post('/auth/login', validatedFields.data, { headers: { 'Content-Type': 'application/json' } })
    if (res.status === 200) {
      await createSession('access_token', res.data.access_token)
      await createSession('refresh_token', res.data.refresh_token, 15)
    }
    redirectPath = "/dashboard"
  } catch (error) {
    // @ts-ignore
    const res = error.response;
    if (res) {
      if (res.status === 404) {
        return {
          errors: {
            other: ["email doesn't  exists"],
          } as LoginValidateError
        }
      }
      if (res.status === 401) {
        return {
          errors: {
            other: ["email or password is incorrect"],
          } as LoginValidateError
        }
      }
    }

  } finally {
    if (redirectPath) redirect(redirectPath)
  }

}
