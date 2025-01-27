import { API } from "./axios";
import { ApiError } from "./ApiError";

async function getPlan(id: string): Promise<Plan> {
  try {
    const res = await API.get<Plan>(`subscriptions/plans/${id}`);
    return res.data
  } catch (error) {
    console.log(`PLANS_API GET_PLAN ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO GET PLAN")
  }
}

async function getPlans(): Promise<Plan[]> {
  try {
    const res = await API.get<Plan[]>('subscriptions/plans');
    return res.data
  } catch (error) {
    console.log(`PLANS_API GET_PLANS, ERR: ${error}`)
    throw new ApiError("FAILED TO GET PLANS")
  }
}

export {
  getPlan,
  getPlans,
};

