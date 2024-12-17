import { API } from '@/api/axios'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  name: z.string().min(1, { message: 'Please enter your name' }),
})

export type FormState =
  | {
    errors?: {
      email?: string[]
      name?: string[]
      other?: string[];
    }
    message?: string
  }
  | undefined


type ValidateError = {
  email?: string[] | undefined;
  name?: string[] | undefined;
  other?: string[] | undefined;
}

export async function updateUserInfo(state: FormState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as ValidateError,
    }
  }

  try {
    await API.put('/auth/userinfo', validatedFields.data, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    // @ts-ignore
    console.log(error)
  }
}
