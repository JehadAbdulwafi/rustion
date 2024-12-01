import { deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function logout() {
  await deleteSession("access_token")
  await deleteSession("refresh_token")
  redirect('/auth')
}
