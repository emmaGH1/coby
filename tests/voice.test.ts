import assert from 'node:assert/strict';
import test from 'node:test';
import { offlineVoiceAvailable } from '../src/voice/offline';
import { VoiceSession } from '../src/voice/session';
import { speechErrorMessage } from '../src/voice/speech';

test('one voice attempt stays locked through startup and finalization', () => {
  const session = new VoiceSession();
  assert.equal(session.begin('Already typed.'), true);
  assert.equal(session.begin('Second tap'), false);
  session.starting(); session.ready();
  assert.equal(session.stop(), true);
  assert.equal(session.stop(), false);
  assert.equal(session.begin('Too early'), false);
  assert.equal(session.result('Buy milk.', true), 'Already typed. Buy milk.');
  assert.deepEqual(session.end(), { text: 'Already typed. Buy milk.', empty: false });
  assert.equal(session.begin('Already typed. Buy milk.'), true);
});

test('network failure retains partial words and retry appends without losing them', () => {
  const session = new VoiceSession();
  session.begin('Tomorrow:'); session.starting(); session.ready();
  assert.equal(session.result('call the dentist', false), 'Tomorrow: call the dentist');
  session.fail();
  assert.equal(session.begin('too early'), false);
  const ended = session.end()!;
  assert.deepEqual(ended, { text: 'Tomorrow: call the dentist', empty: false });
  session.begin(ended.text); session.starting(); session.ready();
  assert.equal(session.result('and buy milk', true), 'Tomorrow: call the dentist and buy milk');
});

test('empty final result cannot erase interim words and final replaces interim', () => {
  const session = new VoiceSession();
  session.begin(''); session.starting(); session.ready();
  session.result('water', false);
  assert.equal(session.result('', true), null);
  assert.equal(session.result('water the plants', true), 'water the plants');
  assert.equal(session.result('then', false), 'water the plants then');
  assert.equal(session.result('then take out the bins', true), 'water the plants then take out the bins');
  assert.deepEqual(session.end(), { text: 'water the plants then take out the bins', empty: false });
});

test('cancel and watchdog release capture and ignore late native events', () => {
  const session = new VoiceSession();
  session.begin('Keep me'); session.starting(); session.ready(); session.cancel();
  session.ready();
  assert.equal(session.result('stale words', true), null);
  assert.equal(session.end(), null);
  assert.equal(session.phase, 'idle');
  assert.equal(session.begin('Keep me'), true);
});

test('no words is reported only for a normal empty attempt', () => {
  const session = new VoiceSession();
  session.begin('Typed text'); session.starting(); session.ready();
  assert.deepEqual(session.end(), { text: 'Typed text', empty: true });
  session.begin('Typed text'); session.starting(); session.fail();
  assert.deepEqual(session.end(), { text: 'Typed text', empty: false });
});

test('a previous native end cannot terminate permission or model preparation', () => {
  const session = new VoiceSession();
  session.begin('Keep these words');
  assert.equal(session.end(), null);
  assert.equal(session.phase, 'preparing');
  session.cancel();
  assert.equal(session.begin('Keep these words'), true);
});

test('native language and server errors have different recovery instructions', () => {
  assert.match(speechErrorMessage('language-not-supported', 13), /not installed/i);
  assert.match(speechErrorMessage('network', 4), /service is unavailable/i);
  assert.match(speechErrorMessage('network', 2), /could not connect/i);
});

test('offline voice requires an installed locale, not just a supported language', async () => {
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => ({ installedLocales: [] }) }), false);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => ({ installedLocales: ['en_US'] }) }), true);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => ({ installedLocales: ['en-GB'] }) }), false);
});
test('unsupported offline recognition never queries models', async () => {
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => false, getSupportedLocales: async () => { throw new Error('Must not query'); } }), false);
});
test('a failed or stalled model query keeps online voice usable', async () => {
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => { throw new Error('Native service unavailable'); }, getSupportedLocales: async () => ({ installedLocales: [] }) }), false);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => { throw new Error('Service unavailable'); } }), false);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: () => new Promise(() => {}) }, 'en-US', 5), false);
});
