import { API } from '@/api/axios'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
})

export type FormState =
  | {
    errors?: {
      email?: string[]
      other?: string[]
    }
    message?: string
  }
  | undefined


type ValidateError = {
  email?: string[] | undefined;
  other?: string[] | undefined;
}

export async function forgotPassword(state: FormState, formData: FormData) {
  let redirectPath: string | null = null
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as ValidateError,
    }
  }

  try {
    await API.post('/auth/forgot-password', validatedFields.data, { headers: { 'Content-Type': 'application/json' } })
    redirectPath = "/auth/forgot-password/complete"
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
      return {
        errors: {
          other: ["Something went wrong, please try again later"],
        } as ValidateError
      }
    }

  } finally {
    if (redirectPath) redirect(redirectPath)
  }

}
