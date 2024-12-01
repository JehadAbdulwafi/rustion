import 'server-only'

import { cookies } from 'next/headers'
import { cache } from 'react'
import { jwtDecode } from "jwt-decode";
import { redirect } from 'next/navigation'
import { API } from '@/api/axios';

export const verifySession = cache(async () => {
  const session = (await cookies()).get('access_token')?.value

  if (!session) {
    return redirect('/login')
  }

  const userID = jwtDecode(session)?.sub;

  return { isAuth: true, userID, session }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const { data } = await API.get(`/auth/userinfo`)

    if (data.id !== session.userID) {
      console.warn('User ID does not match')
    }

    return data as User
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
