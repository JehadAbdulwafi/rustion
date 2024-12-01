import { API } from "./axios"

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
  const { data } = await API.get<AppSettings>("/settings")
  return data
}

export async function updateAppSettings(settings: Partial<AppSettings>) {
  const { data } = await API.patch<AppSettings>("/settings", settings)
  return data
}
