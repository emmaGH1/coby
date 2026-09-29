import * as Notifications from 'expo-notifications';
import type { Clock } from '../domain/clock';
import { planNudges } from '../domain/nudges';
import type { CobyItem } from '../domain/types';

const CHANNEL = 'coby-gentle';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true,
    shouldPlaySound: false, shouldSetBadge: false,
  }),
});

async function cancelItemNudges(itemId: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const request of scheduled) {
    if (request.content.data?.itemId === itemId) {
      await Notifications.cancelScheduledNotificationAsync(request.identifier);
    }
  }
}

export async function syncItemNudges(item: CobyItem, clock: Clock): Promise<boolean> {
  await cancelItemNudges(item.id);
  const nudges = planNudges(item, clock);
  if (!nudges.length) return true;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Coby reminders', importance: Notifications.AndroidImportance.DEFAULT,
  });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return false;
  for (const nudge of nudges) {
    await Notifications.scheduleNotificationAsync({
      content: { title: item.title, body: nudge.body, data: { itemId: item.id, kind: nudge.kind } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: nudge.at, channelId: CHANNEL },
    });
  }
  return true;
}

export async function triggerLabNudge(item: CobyItem): Promise<void> {
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Coby reminders', importance: Notifications.AndroidImportance.DEFAULT,
  });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Notification permission denied');
  await Notifications.scheduleNotificationAsync({
    content: { title: item.title, body: 'This is a good time to start.', data: { itemId: item.id, lab: true } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2, channelId: CHANNEL },
  });
}

export async function clearAllCobyNudges(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
