import { API } from '@/api/axios'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const ChangePasswordFormSchema = z.object({
  currentPassword: z.string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .trim(),
  newPassword: z.string().min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .trim(),
  newPasswordConfirmation: z.string().min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .trim()
})
  .refine(
    (values) => {
      return values.newPassword === values.newPasswordConfirmation;
    },
    {
      message: "The password don't match",
      path: ["newPasswordConfirmation"],
    }
  );

export type ChangePasswordFormState =
  | {
    errors?: {
      currentPassword?: string[]
      newPassword?: string[]
      newPasswordConfirmation?: string[]
      other?: string[];
    }
    message?: string
  }
  | undefined


type ChangePasswordValidateError = {
  currentPassword?: string[] | undefined;
  newPassword?: string[] | undefined;
  newPasswordConfirmation?: string[] | undefined;
  other?: string[] | undefined;
}

export async function changePassword(state: ChangePasswordFormState, formData: FormData) {
  let redirectPath: string | null = null
  const validatedFields = ChangePasswordFormSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    newPasswordConfirmation: formData.get('newPasswordConfirmation'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as ChangePasswordValidateError,
    }
  }

  try {
    const res = await API.post('/auth/change-password', validatedFields.data, { headers: { 'Content-Type': 'application/json' } })
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
          } as ChangePasswordValidateError
        }
      }
      if (res.status === 401) {
        return {
          errors: {
            other: ["email or password is incorrect"],
          } as ChangePasswordValidateError
        }
      }
    }

  } finally {
    if (redirectPath) redirect(redirectPath)
  }

}
