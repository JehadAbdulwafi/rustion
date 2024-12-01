import axios, { InternalAxiosRequestConfig } from "axios";
import { getSession } from "../lib/session";

const BASE_URL = "http://192.168.1.10:9973/api/v1";

export const API = axios.create({
  baseURL: BASE_URL,
});

// cors
API.defaults.headers.get["Accept"] = "application/json";
API.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
API.defaults.headers.common["Access-Control-Allow-Headers"] =
  "Origin, X-Requested-With, Content-Type, Accept";

const authInterceptor = async (value: InternalAxiosRequestConfig<any>) => {
  const access_token = await getSession("access_token");
  if (access_token) {
    value.headers.Authorization = `Bearer ${access_token}`;
  }
  return value;
};

API.interceptors.request.use(authInterceptor);

export const handleApiError = async (error: unknown) => {
  try {
    // @ts-ignore
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data };
  } catch (err) {
    throw new Error("An unexpected error occurred.");
  }
};

