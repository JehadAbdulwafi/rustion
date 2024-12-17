import { API } from '@/api/axios'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const FormSchema = z.object({
  token: z.string().min(1, { message: 'Please enter a valid token.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .trim(),
})

export type FormState =
  | {
    errors?: {
      token?: string[]
      password?: string[]
      other?: string[]
    }
    message?: string
  }
  | undefined


type ValidateError = {
  token?: string[] | undefined;
  password?: string[] | undefined;
  other?: string[] | undefined;
}

export async function forgotPasswordComplete(state: FormState, formData: FormData) {
  let redirectPath: string | null = null
  const validatedFields = FormSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as ValidateError,
    }
  }

  try {
    const res = await API.post('/auth/forgot-password/complete', validatedFields.data, { headers: { 'Content-Type': 'application/json' } })
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
          } as ValidateError
        }
      }
      if (res.status === 401) {
        return {
          errors: {
            other: ["email or password is incorrect"],
          } as ValidateError
        }
      }

      return {
        errors: {
          other: ["Something went wrong!"],
        } as ValidateError
      }
    }

  } finally {
    if (redirectPath) redirect(redirectPath)
  }

}
