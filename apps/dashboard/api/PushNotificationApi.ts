import { API } from "./axios"

export type PushNotification = {
  id: string
  title: string
  body: string
  image?: string
  created_at: string
  sent_at?: string
  status: "draft" | "sent" | "failed"
}

export async function getPushNotifications() {
  const { data } = await API.get<PushNotification[]>("/notifications")
  return data
}

export async function createPushNotification(data: {
  title: string
  body: string
  image?: string
}) {
  const response = await API.post<PushNotification>("/notifications", data)
  return response.data
}

export async function sendPushNotification(id: string) {
  const response = await API.post<PushNotification>(
    `/notifications/${id}/send`
  )
  return response.data
}

export async function deletePushNotification(id: string) {
  const response = await API.delete<PushNotification>(`/notifications/${id}`)
  return response.data
}
