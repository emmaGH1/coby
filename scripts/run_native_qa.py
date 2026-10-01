"""Isolated emulator checks. Never run against the user's Coby package."""
import subprocess
import time
from pathlib import Path

PACKAGE = 'com.emmagh1.coby.nativeqa'

def adb(*args):
    return subprocess.check_output(['adb', *args]).decode(errors='replace')

def main():
    adb('install', 'android/app/build/outputs/apk/release/app-release.apk')
    adb('shell', 'pm', 'grant', PACKAGE, 'android.permission.POST_NOTIFICATIONS')
    adb('logcat', '-c')
    adb('shell', 'am', 'start', '-n', f'{PACKAGE}/.MainActivity')
    for _ in range(60):
        logs = adb('logcat', '-d', '-s', 'ReactNativeJS:I')
        if 'COBY_QA FAIL' in logs:
            raise RuntimeError(logs)
        if 'COBY_QA WAITING_FOR_PERSISTENT' in logs:
            break
        time.sleep(1)
    else:
        raise RuntimeError('Native QA did not become ready')
    assert 'COBY_QA BULK_CLEAR_PASS' in logs
    adb('shell', 'input', 'keyevent', '3')
    kinds = set()
    # Real wall-clock delivery: do not replace the scheduler with fake notifications.
    deadline = time.monotonic() + 32 * 60
    while time.monotonic() < deadline:
        text = adb('shell', 'dumpsys', 'notification', '--noredact')
        # This fresh emulator contains synthetic fixtures only.
        if PACKAGE in text:
            for kind, body in [('comfortable', 'This is a good time to start.'), ('latest', 'Start now to finish on time.')]:
                if body in text:
                    kinds.add(kind)
        if len(kinds) == 2:
            break
        time.sleep(10)
    assert kinds == {'comfortable', 'latest'}, f'Persistent actual delivery incomplete: {kinds}'
    adb('shell', 'am', 'kill', PACKAGE)
    adb('logcat', '-c')
    adb('shell', 'am', 'start', '-n', f'{PACKAGE}/.MainActivity')
    for _ in range(45):
        if 'COBY_QA RESTART_PASS' in adb('logcat', '-d', '-s', 'ReactNativeJS:I'):
            break
        time.sleep(1)
    else:
        raise RuntimeError('Cold restart did not retain bulk clear and history')
    output = Path('artifacts/native-qa.txt')
    output.parent.mkdir(exist_ok=True)
    output.write_text('BULK_CLEAR_PASS: native SQLite removal, completed/archived retained, pending reminders cancelled.\nPERSISTENT_DELIVERY_PASS: both planned reminders delivered while app backgrounded.\nRESTART_PASS: cleared rows stay removed and completed/archived history stays saved.\nOS action taps still require separate acceptance.\n')
    print(output.read_text())

if __name__ == '__main__':
    main()
