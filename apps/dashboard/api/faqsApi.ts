import { ApiError } from "./ApiError";
import { API } from "./axios";

async function getFAQs(): Promise<FAQ[]> {
  try {
    const res = await API.get<FAQ[]>('faqs');
    return res.data
  } catch (error) {
    throw new ApiError("FAILED TO GET FAQs")
  }
}

export {
  getFAQs,
};
