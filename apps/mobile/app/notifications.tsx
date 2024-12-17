import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { getNotifications, markNotificationAsRead, Notification, clearAllNotifications } from '@/utils/notificationStorage';
import { format } from 'date-fns';
import { navigationHeight } from '@/constants';
import { View } from '@/components/ui/View';
import { Text } from '@/components/ui/Text';
import { Accordion, YStack } from 'tamagui';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotifications } from '@/providers/NotificationsProvider';

const { width } = Dimensions.get('window');
const imageHeight = (width - 24) * (9 / 16); // 16:9 ratio

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { action } = useLocalSearchParams();
  const router = useRouter();
  const { setHasNotifications } = useNotifications();

  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setHasNotifications(notifs.length > 0);
  };

  useEffect(() => {
    loadNotifications();
    return () => {
      setHasNotifications(false);
    };
  }, []);

  useEffect(() => {
    if (action === 'clear') {
      clearAllNotifications();
      loadNotifications();
      router.setParams({});
    }
  }, [action]);

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
      loadNotifications();
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <Accordion
      overflow="hidden"
      width="100%"
      type="multiple"
      onValueChange={() => handleNotificationPress(item)}
    >
      <Accordion.Item value={item.id} br={0}>
        <Accordion.Trigger
          flexDirection="row"
          justifyContent="space-between"
          backgroundColor={item.read ? '#121212' : '#1d1d1d'}
          padding={12}
          borderTopEndRadius={6}
          borderTopStartRadius={6}
          borderWidth={0}
        >
          {({ open }: { open: boolean }) => (
            <>
              <View style={styles.headerContent}>
                {item.picture && !open && (
                  <Image source={{ uri: item.picture }} style={styles.thumbnailImage} />
                )}
                <View style={styles.textContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  {!open && (
                    <Text numberOfLines={1} color={"$color11"} style={styles.body}>
                      {item.body}
                    </Text>
                  )}

                  {!open && (
                    <Text style={styles.timestamp} color={"$color10"}>
                      {format(item.timestamp, 'MMM d, yyyy h:mm a')}
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.HeightAnimator paddingTop={0} marginTop={0} animation="200ms">
          <Accordion.Content
            animation="medium"
            exitStyle={{ opacity: 0 }}
            paddingTop={0}
            paddingHorizontal={12}
            paddingBottom={12}
            borderBottomEndRadius={6}
            borderBottomStartRadius={6}
            backgroundColor={item.read ? '#121212' : '#1d1d1d'}
          >
            <YStack gap={12}>
              <Text style={styles.bodyExpanded} color={"$color11"}>{item.body}</Text>
              {item.picture && (
                <Image
                  source={{ uri: item.picture }}
                  style={styles.fullImage}
                  resizeMode="cover"
                />
              )}

              <Text style={styles.timestamp} color={"$color9"}>
                {format(item.timestamp, 'MMM d, yyyy h:mm a')}
              </Text>
            </YStack>
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>
    </Accordion>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          skipEnteringExitingAnimations
          layout={LinearTransition}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    gap: 8,
    padding: 12,
    paddingBottom: navigationHeight + 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  fullImage: {
    width: '100%',
    height: imageHeight,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    marginBottom: 4,
  },
  bodyExpanded: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
