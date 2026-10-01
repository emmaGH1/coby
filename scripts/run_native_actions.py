"""Run the production App inside the isolated QA package on a fresh emulator."""
import re
import time
from capture_native_flow import adb, tap, expect, capture, tree, locate, type_dump, OUT

PACKAGE = 'com.emmagh1.coby.nativeqa'

def start():
    adb('logcat', '-c')
    adb('shell', 'am', 'start', '-n', f'{PACKAGE}/.MainActivity')
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        logs = adb('logcat', '-d', '-s', 'ReactNativeJS:I')
        assert 'COBY_QA FAIL' not in logs, logs
        if ('COBY_QA QUICK_READY' in logs or 'COBY_QA RESTART_PASS' in logs) and (locate('Brain dump') or locate('A little check-in.')):
            return
        time.sleep(1)
    raise RuntimeError('Isolated App did not reach its ready capture surface')

def restart():
    adb('shell', 'input', 'keyevent', '3')
    time.sleep(2)
    for _ in range(10):
        adb('shell', 'am', 'kill', PACKAGE)
        time.sleep(1)
        if not adb('shell', f'pidof {PACKAGE} || true').strip():
            break
    else:
        raise RuntimeError('Background QA process did not stop; refusing to claim cold restart')
    start()

def report(marker):
    logs = adb('logcat', '-d', '-s', 'ReactNativeJS:I')
    assert f'COBY_QA {marker}' in logs, f'Native state verification missing: {marker}'

def notification_action(label):
    adb('shell', 'input', 'keyevent', '3')
    time.sleep(3)
    adb('shell', 'cmd', 'statusbar', 'expand-notifications')
    time.sleep(2)
    for _ in range(4):
        if locate(label):
            break
        candidates = []
        for node in tree().iter('node'):
            descendants = list(node.iter('node'))
            if not any('Coby isolated QA persistent-delivery' in (child.get('text') or '') for child in descendants):
                continue
            buttons = [child for child in descendants if (child.get('resource-id') or '').endswith('/expand_button')]
            if buttons:
                candidates.append((len(descendants), buttons[0]))
        if not candidates:
            raise RuntimeError('Coby notification expansion control missing')
        button = min(candidates, key=lambda entry: entry[0])[1]
        values = [int(x) for x in re.findall(r'\d+', button.get('bounds', ''))]
        assert len(values) == 4
        adb('shell', 'input', 'tap', str((values[0]+values[2])//2), str((values[1]+values[3])//2))
        time.sleep(1)
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
    if locate('Back to Home'):
        tap('Back to Home')
    tap('Brain dump')
    type_dump('Keep the spare key somewhere safe')
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
            (OUT / 'flow-action-failure.xml').write_text(adb('shell', 'cat', '/sdcard/coby-qa.xml'))
            (OUT / 'native-action-log.txt').write_text(adb('logcat', '-d', '-s', 'ReactNativeJS:I'))
        raise
