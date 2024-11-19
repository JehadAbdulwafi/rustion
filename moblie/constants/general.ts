import {
  BufferConfig,
} from 'react-native-video';
import { Platform } from 'react-native';

export const isIos = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

export const bufferConfig: BufferConfig = {
  minBufferMs: 15000,
  maxBufferMs: 50000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000,
  live: {
    targetOffsetMs: 500,
  },
};
