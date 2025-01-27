import { API } from "./axios";
import { FieldValues } from "react-hook-form";
import { ApiError } from "./ApiError";

async function getUserActiveSubscription(): Promise<Subscription> {
  try {
    const res = await API.get<Subscription>("subscriptions/active");
    return res.data
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API GET_USER_SUBSCRIPTION, ERR: ${error}`)
    throw new ApiError("FAILED TO GET USER SUBSCRIPTION")
  }
}

async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const res = await API.get<Subscription[]>("subscriptions");
    return res.data
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API GET_USER_SUBSCRIPTION, ERR: ${error}`)
    throw new ApiError("FAILED TO GET USER SUBSCRIPTION")
  }
}

async function getTransactions(): Promise<Transaction[]> {
  try {
    const res = await API.get<Transaction[]>('subscriptions/transactions');
    return res.data
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API GET_TRANSACTIONS, ERR: ${error}`)
    throw new ApiError("FAILED TO GET TRANSACTIONS")
  }
}

async function subscribe(data: FieldValues): Promise<Subscription> {
  try {
    const res = await API.post<Subscription>(`subscriptions/subscribe`, { ...data });
    return res.data;
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API SUBSCRIBE, ERR: ${error}`)
    throw new ApiError("FAILED TO SUBSCRIBE")
  }
}

async function renewSubscription(id: string): Promise<Subscription> {
  try {
    const res = await API.post<Subscription>(`subscriptions/${id}/renew`);
    return res.data;
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API RENEW, ERR: ${error}`)
    throw new ApiError("FAILED TO RENEW SUBSCRIPTION")
  }
}


async function Resubscribe(id: string): Promise<Subscription> {
  try {
    const res = await API.post<Subscription>(`subscriptions/${id}/resubscribe`);
    return res.data;
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API UPGRADE, ERR: ${error}`)
    throw new ApiError("FAILED TO UPGRADE SUBSCRIPTION")
  }
}

async function upgradeSubscription(data: Partial<Subscription>): Promise<Subscription> {
  try {
    const res = await API.post<Subscription>(`subscriptions/upgrade`, { ...data });
    return res.data;
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API UPGRADE, ERR: ${error}`)
    throw new ApiError("FAILED TO UPGRADE SUBSCRIPTION")
  }
}

async function cancelActiveSubscription(id: string): Promise<void> {
  try {
    await API.delete(`subscriptions/${id}/cancel`);
  } catch (error) {
    console.log(`SUBSCRIPTIONS_API CANCEL ACTIVE SUBSCRIPTION, ERR: ${error}`)
    throw new ApiError("FAILED TO CANCEL ACTIVE SUBSCRIPTION")
  }
}


export {
  getUserActiveSubscription,
  getTransactions,
  subscribe,
  renewSubscription,
  upgradeSubscription,
  cancelActiveSubscription,
  getSubscriptions,
  Resubscribe
};
