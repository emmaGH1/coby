"""Run the production App inside the isolated QA package on a fresh emulator."""
import re
import time
from capture_native_flow import adb, tap, expect, capture, tree, locate, OUT

PACKAGE = 'com.emmagh1.coby.nativeqa'

def start():
    adb('logcat', '-c')
    adb('shell', 'am', 'start', '-n', f'{PACKAGE}/.MainActivity')
    time.sleep(4)

def restart():
    adb('shell', 'input', 'keyevent', '3')
    adb('shell', 'am', 'kill', PACKAGE)
    start()

def report(marker):
    logs = adb('logcat', '-d', '-s', 'ReactNativeJS:I')
    assert f'COBY_QA {marker}' in logs, f'Native state verification missing: {marker}'

def notification_action(label):
    adb('shell', 'input', 'keyevent', '3')
    time.sleep(3)
    adb('shell', 'cmd', 'statusbar', 'expand-notifications')
    time.sleep(2)
    if not locate(label):
        for node in tree().iter('node'):
            if (node.get('resource-id') or '').endswith('/expand_button'):
                values = [int(x) for x in re.findall(r'\d+', node.get('bounds', ''))]
                if len(values) == 4:
                    adb('shell', 'input', 'tap', str((values[0]+values[2])//2), str((values[1]+values[3])//2))
                    time.sleep(1)
                    break
    tap(label)
    time.sleep(2)

def main():
    assert adb('get-serialno').strip().startswith('emulator-'), 'Refusing a real phone'
    OUT.mkdir(exist_ok=True)
    adb('install', 'android/app/build/outputs/apk/release/app-release.apk')
    adb('shell', 'pm', 'grant', PACKAGE, 'android.permission.POST_NOTIFICATIONS')
    start()
    notification_action('30 min')
    expect('I’ll check in again in 30 minutes. Your due time is unchanged.')
    capture('flow-os-30-min')
    restart(); report('OS_DELAY_30_PASS')
    notification_action('1 hour')
    expect('I’ll check in again in 1 hour. Your due time is unchanged.')
    capture('flow-os-60-min')
    restart(); report('OS_DELAY_60_PASS')
    tap('Brain dump')
    adb('shell', 'input', 'text', 'Keep%sthe%sspare%skey%ssomewhere%ssafe')
    adb('shell', 'input', 'keyevent', '4')
    tap('Let Coby understand this')
    expect('Keep as one item'); capture('flow-parser-failure')
    tap('Keep as one item')
    expect('Item 1 title'); capture('flow-offline-receipt')
    tap('Looks right. Hold it.', scroll=True)
    restart(); report('OFFLINE_RETENTION_PASS')
    (OUT / 'native-qa.txt').write_text('OS_DELAY_30_PASS and OS_DELAY_60_PASS: actual Android category buttons, production App handler, persisted delay, original deadline retained, one pending request.\nOFFLINE_RETENTION_PASS: missing Gemini configuration displays recovery, explicit one-item receipt holds intact text/null timing, persists after restart.\n')

if __name__ == '__main__':
    try:
        main()
    except Exception:
        if adb('get-serialno').strip().startswith('emulator-'):
            OUT.mkdir(exist_ok=True)
            capture('flow-action-failure')
        raise
