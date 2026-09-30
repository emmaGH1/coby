// Uses the Android SDK emulator_controller.proto MicrophoneState RPC.
// The emulator's local token stays in memory and is never printed.
const fs = require('node:fs');
const path = require('node:path');
const http2 = require('node:http2');
async function main() {
  const root = path.join(process.env.LOCALAPPDATA, 'Temp', 'avd', 'running');
  const ini = fs.readdirSync(root).find((name) => name.endsWith('.ini'));
  if (!ini) throw new Error('Start the Android emulator first.');
  const config = Object.fromEntries(fs.readFileSync(path.join(root, ini), 'utf8').split(/\r?\n/).filter((line) => line.includes('=')).map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]));
  const client = http2.connect('http://127.0.0.1:' + config['grpc.port']);
  client.on('error', () => {});
  async function rpc(method, payload = Buffer.alloc(0)) {
    return new Promise((resolve, reject) => {
      const request = client.request({ ':method': 'POST', ':path': '/android.emulation.control.EmulatorController/' + method, 'content-type': 'application/grpc', authorization: 'Bearer ' + config['grpc.token'], te: 'trailers' });
      const chunks = [];
      request.setTimeout(10000, () => request.destroy(new Error('Emulator microphone request timed out.')));
      request.on('error', reject);
      request.on('data', (chunk) => chunks.push(chunk));
      request.on('trailers', (headers) => { if (headers['grpc-status'] !== '0') reject(new Error('Emulator rejected microphone request: ' + headers['grpc-status'])); });
      request.on('end', () => resolve(Buffer.concat(chunks).subarray(5)));
      const frame = Buffer.alloc(5); frame.writeUInt32BE(payload.length, 1);
      request.end(Buffer.concat([frame, payload]));
    });
  }
  try {
    const before = await rpc('getMicrophoneState');
    console.log('Host microphone forwarding:', before[0] === 8 && before[1] === 1 ? 'on' : 'off');
    if (process.argv.includes('--enable')) await rpc('setMicrophoneState', Buffer.from([8, 1]));
    const after = await rpc('getMicrophoneState');
    console.log('Verified host microphone forwarding:', after[0] === 8 && after[1] === 1 ? 'on' : 'off');
  } finally { client.close(); }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
