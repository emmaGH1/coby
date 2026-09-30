import assert from 'node:assert/strict';
import test from 'node:test';
import { offlineVoiceAvailable } from '../src/voice/offline';

test('offline voice requires an installed locale, not just a supported language', async () => {
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => ({ installedLocales: [] }) }), false);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => ({ installedLocales: ['en_US'] }) }), true);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => ({ installedLocales: ['en-GB'] }) }), false);
});
test('unsupported offline recognition never queries models', async () => {
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => false, getSupportedLocales: async () => { throw new Error('Must not query'); } }), false);
});
test('a failed or stalled model query keeps online voice usable', async () => {
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: async () => { throw new Error('Service unavailable'); } }), false);
  assert.equal(await offlineVoiceAvailable({ supportsOnDeviceRecognition: () => true, getSupportedLocales: () => new Promise(() => {}) }, 'en-US', 5), false);
});
