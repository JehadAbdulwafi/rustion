import { getAppIdSession } from "@/actions"
import { API } from "./axios"
import { ApiError } from "./ApiError"

export type AppSettings = {
  app_icon_url: string
  splash_screen_url: string
  privacy_policy_url: string
  terms_url: string
  support_url: string
  app_store_url: string
  play_store_url: string
  app_version: string
  force_update: boolean
  maintenance_mode: boolean
  maintenance_message: string
  ads_enabled: boolean
  banner_ad_unit_id: string
  interstitial_ad_unit_id: string
  rewarded_ad_unit_id: string
}

export async function getAppSettings() {
  try {
    const id = await getAppIdSession();
    const { data } = await API.get<App>(`/apps/${id}`)
    return data
  } catch (error) {
    console.log(`APP_SETTINGS GET_APP_SETTINGS, ERR: ${error}`)
    throw new ApiError("FAILED TO GET APP SETTINGS")
  }
}

export async function updateAppSettings(values: Partial<AppSettings>) {
  try {
    const id = await getAppIdSession();
    const config = JSON.stringify(values)
    const { data } = await API.put(`/apps/${id}`, { config })
    return data
  } catch (error) {
    console.log(`APP_SETTINGS UPDATE_APP_SETTINGS, ERR: ${error}`)
    throw new ApiError("FAILED TO UPDATE APP SETTINGS")

  }
}
