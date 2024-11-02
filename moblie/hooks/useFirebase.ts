import { PermissionsAndroid } from 'react-native'
import { useEffect } from 'react'
export {
  ErrorBoundary,
} from 'expo-router'
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import storage from './storage';
import { PostUpdatePushToken } from '@/api/PushApi';
import * as Device from "expo-device";


const useFirebase = () => {

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
    requestUserPermission()
      .catch(console.error);


    bootstrap()
      .catch(console.error);

    const unsubscribe = messaging().onMessage((m) =>
      onMessageReceived(m)
    );
    messaging().setBackgroundMessageHandler((m) => onMessageReceived(m));
    return unsubscribe;
  }, [])

  return {}
}

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  try {
    // @ts-ignore
    const { title, body, picture, largeIcon } =
      message.data;
    displayNotification(
      title,
      body,
      picture,
      largeIcon,
    );
  } catch (error) {
    console.warn("ON MESSAGE RECEIVED:", error);
  }
}

const displayNotification = async (
  title: string,
  body: string,
  picture?: string,
  largeIcon?: string,
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
          largeIcon,
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
        largeIcon,
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
  const oldToken = await storage.getItem("fcm_token");
  const fingerprint = Device.osBuildFingerprint!.replaceAll("/", "-");
  if (fcmToken === oldToken) return;

  try {
    const payload = {
      fingerprint,
      newToken: fcmToken,
      oldToken: oldToken,
      provider: 'fcm',
    };

    await PostUpdatePushToken(payload);
    await storage.setItem("fcm_token", fcmToken);

  } catch (error) {
    console.warn("HANDLE EFFECT NOTIFICATION", error);
  }
}

export default useFirebase
