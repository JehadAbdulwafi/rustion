import 'server-only'

import { cookies } from 'next/headers'
import { cache } from 'react'
import { jwtDecode } from "jwt-decode";
import { redirect } from 'next/navigation'
import { API } from '@/api/axios';
import { ApiError } from '@/api/ApiError';

export const verifySession = cache(async () => {
  const session = (await cookies()).get('access_token')?.value

  if (!session) {
    return redirect('/auth/login')
  }

  const userID = jwtDecode(session)?.sub;

  return { isAuth: true, userID, session }
})

export const getUser = cache(async () => {
  try {
    const { userID } = await verifySession()

    const res = await API.get<User>('auth/userinfo')
    const data = res.data

    if (data.id !== userID) {
      console.warn('User ID does not match')
      throw new ApiError("User ID does not match")
    }

    return data as User
  } catch (error) {
    console.log('Failed to fetch user:', error)
    throw new ApiError("FAILED TO FETCH USER")
  }
})
