import { APIV1Client } from './APIV1Client';


async function PostUpdatePushToken(payload: PostUpdatePushTokenPayload): Promise<void> {
  const api = new APIV1Client();
  await api.sendUnauthenticatedApiV1Request('push/token', { method: 'POST', body: payload });
}

export {
  PostUpdatePushToken,
};
