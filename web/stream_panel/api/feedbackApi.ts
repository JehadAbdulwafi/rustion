import { ApiError } from "./ApiError";
import { API } from "./axios";
import { FieldValues } from "react-hook-form";

async function createFeedback(data: FieldValues): Promise<Stream> {
  try {
    const res = await API.post(`feedbacks`, { ...data });
    return res.data;
  } catch (error) {
    throw new ApiError("FAILED TO CREATE FEEDBACK")
  }
}


export {
  createFeedback,
};
