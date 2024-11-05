import { APIV1Client } from './APIV1Client';

type PostUpdatePushTokenPayload = {
  fingerprint: string
  newToken: string
  oldToken: string
  provider: string
}

async function PostUpdatePushToken(payload: PostUpdatePushTokenPayload): Promise<void> {
  const api = new APIV1Client();
  await api.sendUnauthenticatedApiV1Request('push', { method: 'POST', body: payload });
}

export {
  PostUpdatePushToken,
};
