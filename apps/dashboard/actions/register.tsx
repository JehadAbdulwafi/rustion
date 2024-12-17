import { API } from '@/api/axios'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const FormSchema = z.object({
  name: z.string().trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .trim(),
})

export type FormState =
  | {
    errors?: {
      name?: string[]
      email?: string[]
      password?: string[]
      other?: string[]
    }
    message?: string
  }
  | undefined


type ValidateError = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
  other?: string[] | undefined;
}

export async function register(state: FormState, formData: FormData) {
  let redirectPath: string | null = null
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as ValidateError,
    }
  }

  try {
    const res = await API.post('/auth/register', validatedFields.data, { headers: { 'Content-Type': 'application/json' } })
    if (res.status === 200) {
      await createSession('access_token', res.data.access_token)
      await createSession('refresh_token', res.data.refresh_token, 15)
    }
    redirectPath = "/dashboard"
  } catch (error) {
    // @ts-ignore
    const res = error.response;
    if (res) {
      if (res.status === 409) {
        return {
          errors: {
            other: ["Email already exists"],
          } as ValidateError
        }
      }

      return {
        errors: {
          other: ["Something went wrong, please try again!"],
        } as ValidateError
      }
    }

  } finally {
    if (redirectPath) redirect(redirectPath)
  }

}
