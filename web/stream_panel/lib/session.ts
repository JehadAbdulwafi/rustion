"use server";
import 'server-only'
import { cookies } from 'next/headers'
const DAY = 24 * 60 * 60 * 1000

export async function createSession(name: string, session: string, days: number = 7) {
  const expiresAt = new Date(Date.now() + days * DAY)
  const c = await cookies();

  c.set(
    name,
    session,
    {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    }
  )
}

export async function updateSession(name: string, NewSession: string, days: number = 7) {
  const session = (await cookies()).get(name)?.value

  if (!session) {
    await createSession(name, NewSession)
    return
  }

  const expires = new Date(Date.now() + days * DAY)

  const cookieStore = await cookies()
  cookieStore.set(name, NewSession, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}


export async function getSession(name: string) {
  const session = (await cookies()).get(name)?.value
  if (!session) {
    return null
  }

  return session;

}

export async function deleteSession(name: string) {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}

