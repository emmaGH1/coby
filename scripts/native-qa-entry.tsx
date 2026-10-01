// CI-only entry point. The workflow builds this in a separate Android package.
import { registerRootComponent } from 'expo';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { SystemClock } from '../src/domain/clock';
import { planNudges } from '../src/domain/nudges';
import type { CobyItem } from '../src/domain/types';
import { listItems, saveItems, deleteItems, clearItems } from '../src/data/items';
import { syncItemNudges, cancelItemNudges, NUDGE_ACTIONS, triggerLabNudge } from '../src/notifications/scheduler';
import config from '../app.json';
import App from '../App';

const clock = new SystemClock();
function check(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}
function item(id: string, status: CobyItem['status'] = 'planned'): CobyItem {
  return { id, title: `Coby isolated QA ${id}`, sourceText: 'Synthetic QA', sourceFragment: 'Synthetic QA',
    kind: 'task', dueAt: new Date(clock.now().getTime() + 31 * 60_000 + 15_000).toISOString(), dueDate: null,
    durationMinutes: 1, explicitPriority: null, confidence: 1, needsClarification: false,
    clarificationQuestion: null, createdAt: clock.now().toISOString(), status,
    completedAt: status === 'completed' ? clock.now().toISOString() : null, commitmentMode: 'persistent' };
}
function Qa() {
  const [message, setMessage] = useState('Starting isolated native checks…');
  const [showApp, setShowApp] = useState(false);
  const quick = process.env.EXPO_PUBLIC_COBY_NATIVE_QA_MODE === 'quick';
  useEffect(() => {
    void (async () => {
      check(process.env.EXPO_PUBLIC_COBY_NATIVE_QA === 'isolated', 'QA configuration missing');
      check(config.expo.android.package === 'com.emmagh1.coby.nativeqa', 'Refusing QA in the real Coby package');
      const existing = await listItems();
      if (existing.some(entry => entry.id === 'persistent-delivery')) {
        check(!existing.some(entry => entry.id.startsWith('held-')) &&
          existing.some(entry => entry.id === 'completed' && entry.status === 'completed') &&
          existing.some(entry => entry.id === 'archived' && entry.status === 'archived'), 'Clear/history state changed after restart');
        console.info('COBY_QA RESTART_PASS');
        setMessage('RESTART_PASS');
        if (quick) {
          const saved = existing.find(entry => entry.id === 'persistent-delivery')!;
          check(Math.abs(Date.parse(saved.dueAt!) - Date.parse(saved.createdAt) - (31 * 60_000 + 15_000)) < 1000, 'Notification action changed the deadline');
          const delay = saved.lastNudgeResponseId?.includes('coby_delay_30') ? 30 : saved.lastNudgeResponseId?.includes('coby_delay_60') ? 60 : null;
          if (delay) {
            check(Math.abs(Date.parse(saved.reminderAt!) - clock.now().getTime() - delay * 60_000) < 90_000, 'Notification action did not persist the requested delay');
            check((await Notifications.getAllScheduledNotificationsAsync()).length === 1, 'Notification action left duplicate requests');
            console.info(`COBY_QA OS_DELAY_${delay}_PASS`);
          }
          const retained = existing.find(entry => entry.title === 'Keep the spare key somewhere safe');
          if (retained) {
            check(retained.dueAt === null && retained.dueDate === null && retained.durationMinutes === null, 'Offline retention invented timing');
            console.info('COBY_QA OFFLINE_RETENTION_PASS');
          }
          if (delay !== 60) await triggerLabNudge(saved);
          setShowApp(true);
        }
        return;
      }
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.dismissAllNotificationsAsync();
      await clearItems();
      const open = [item('held-a'), item('held-b')];
      const history = [item('completed', 'completed'), item('archived', 'archived')];
      await saveItems([...open, ...history]);
      for (const entry of open) check(await syncItemNudges(entry, clock), 'Notification permission unavailable');
      check((await Notifications.getAllScheduledNotificationsAsync()).length === 4, 'Expected two reminders per open item');
      for (const entry of open) await cancelItemNudges(entry.id);
      await deleteItems(open.map(entry => entry.id));
      const retained = await listItems();
      check(retained.length === 2 && retained.every(entry => entry.status === 'completed' || entry.status === 'archived'), 'Bulk clear removed history or retained open items');
      check((await Notifications.getAllScheduledNotificationsAsync()).length === 0, 'Bulk clear retained reminders');
      setMessage('BULK_CLEAR_PASS');
      // Save a manifest for the cold restart verification; contains synthetic data only.
      console.info('COBY_QA BULK_CLEAR_PASS');
      const persistent = item('persistent-delivery');
      await saveItems([persistent]);
      check(planNudges(persistent, clock).length === 2, 'Persistent must plan both reminders');
      check(await syncItemNudges(persistent, clock), 'Persistent scheduling denied');
      const pending = await Notifications.getAllScheduledNotificationsAsync();
      check(pending.length === 2, 'Persistent native requests missing');
      check(Object.values(NUDGE_ACTIONS).join(',') === '15,30,60', 'Notification actions changed');
      if (quick) {
        await triggerLabNudge(persistent);
        console.info('COBY_QA QUICK_READY');
        setShowApp(true);
        return;
      }
      console.info('COBY_QA WAITING_FOR_PERSISTENT');
      setMessage('WAITING_FOR_PERSISTENT — first in 15s, second in 30m15s.');
    })().catch(error => { setMessage(`FAIL: ${error.message}`); console.error(`COBY_QA FAIL ${error.message}`); });
  }, []);
  return showApp ? <App /> : <View style={{ flex: 1, padding: 32, justifyContent: 'center' }}><Text>{message}</Text></View>;
}
registerRootComponent(Qa);
