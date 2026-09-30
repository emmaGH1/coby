import * as Notifications from 'expo-notifications';
import type { Clock } from '../domain/clock';
import { planNudges } from '../domain/nudges';
import type { CobyItem } from '../domain/types';

const CHANNEL = 'coby-reminders-v2';
const CATEGORY = 'coby_reminder';
export const NUDGE_ACTIONS = { coby_delay_15: 15, coby_delay_30: 30, coby_delay_60: 60 } as const;

export async function prepareNudgeNotifications() {
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Coby reminders', importance: Notifications.AndroidImportance.HIGH,
    sound: 'default', enableVibrate: true,
  });
  await Notifications.setNotificationCategoryAsync(CATEGORY, Object.entries(NUDGE_ACTIONS).map(([identifier, minutes]) => ({
    identifier, buttonTitle: minutes === 60 ? '1 hour' : `${minutes} min`,
    // Foreground processing also works after a cold start without a new
    // background-task dependency. The chosen delay is applied automatically.
    options: { opensAppToForeground: true },
  })));
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true,
    shouldPlaySound: true, shouldSetBadge: false,
  }),
});

export async function cancelItemNudges(itemId: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const request of scheduled) {
    if (request.content.data?.itemId === itemId) {
      await Notifications.cancelScheduledNotificationAsync(request.identifier);
    }
  }
  const presented = await Notifications.getPresentedNotificationsAsync();
  for (const notification of presented) {
    if (notification.request.content.data?.itemId === itemId) {
      await Notifications.dismissNotificationAsync(notification.request.identifier);
    }
  }
}

export async function syncItemNudges(item: CobyItem, clock: Clock): Promise<boolean> {
  await cancelItemNudges(item.id);
  const nudges = planNudges(item, clock);
  if (!nudges.length) return true;
  await prepareNudgeNotifications();
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return false;
  for (const nudge of nudges) {
    await Notifications.scheduleNotificationAsync({
      content: { title: item.title, body: nudge.body, sound: 'default', categoryIdentifier: CATEGORY,
        data: { itemId: item.id, kind: nudge.kind } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: nudge.at, channelId: CHANNEL },
    });
  }
  return true;
}

export async function triggerLabNudge(item: CobyItem): Promise<void> {
  await prepareNudgeNotifications();
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Notification permission denied');
  await Notifications.scheduleNotificationAsync({
    content: { title: item.title, body: 'This is a good time to start.', sound: 'default', categoryIdentifier: CATEGORY,
      data: { itemId: item.id, lab: true } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2, channelId: CHANNEL },
  });
}

export async function clearAllCobyNudges(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
