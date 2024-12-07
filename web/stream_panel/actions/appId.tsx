'use server'

import { createSession, deleteSession, getSession } from "@/lib/session"

export async function setAppIdSession(appId: string) {
  await  createSession('app_id', appId)
}

export async function getAppIdSession() {
  return getSession('app_id')
}

export async function deleteAppIdSession() {
    deleteSession('app_id')
}
