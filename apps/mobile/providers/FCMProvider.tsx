import { PermissionsAndroid } from 'react-native'
import { useEffect } from 'react'
export {
  ErrorBoundary,
} from 'expo-router'
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { PostUpdatePushToken } from '@/api/PushApi';
import * as Device from "expo-device";
import config from '@/api/config';
import { store } from '@/hooks/storage';
import { saveNotification } from '@/utils/notificationStorage';

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
  isBackground = false
) {
  try {
    if (isBackground) return;

    // @ts-ignore
    const { title, body, android } = message?.notification;

    saveNotification({
      title,
      body,
      picture: android?.imageUrl,
    });

    displayNotification(
      title,
      body,
      android?.imageUrl,
    );
  } catch (error) {
    console.warn("ON MESSAGE RECEIVED:", error);
  }
}

const displayNotification = async (
  title: string,
  body: string,
  picture?: string,
) => {
  try {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });

    if (picture) {
      return await notifee.displayNotification({
        title,
        body,
        android: {
          channelId,
          largeIcon: picture,
          style: { type: AndroidStyle.BIGPICTURE, picture: picture },
          pressAction: {
            id: "open-app",
            launchActivity: "default",
          },
        },
      });
    }

    return await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        pressAction: {
          id: "open-app",
          launchActivity: "default",
        },
      },
    });

  } catch (error) {
    console.warn("DISPLAY NOTIFICATION:", error);
  }
};


const handleEffectNotification = async (fcmToken: string) => {
  if (!fcmToken) return;
  const oldToken = store.getString("fcm_token");
  const fingerprint: string = Device.osBuildFingerprint!.replaceAll("/", "-");
  if (fcmToken === oldToken) return;

  try {
    const payload: PostUpdatePushTokenPayload = {
      app_id: config.app.id,
      fingerprint,
      newToken: fcmToken,
      oldToken: oldToken!,
      provider: 'fcm',
    };

    store.set("fcm_token", fcmToken);
    await PostUpdatePushToken(payload);

  } catch (error) {
    console.warn("HANDLE EFFECT NOTIFICATION", error);
  }
}

export default function FCMProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  async function requestUserPermission() {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        return handleEffectNotification(token);
      }
    } catch (error) {
      console.warn("REQUEST USER PERMISSION:", error);
    }
  }

  async function bootstrap() {
    await notifee.getInitialNotification();
  }

  useEffect(() => {
    // Set up Notifee background handler
    notifee.onBackgroundEvent(async () => { });

    requestUserPermission()
      .catch(console.error);

    bootstrap()
      .catch(console.error);

    const unsubscribe = messaging().onMessage((m) =>
      onMessageReceived(m, false)
    );
    messaging().setBackgroundMessageHandler((m) => onMessageReceived(m, true));
    return unsubscribe;
  }, [])

  return children
}
