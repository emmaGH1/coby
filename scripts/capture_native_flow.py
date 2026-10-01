"""Acceptance and synthetic footage on a fresh CI emulator, never a phone."""
import re
import subprocess
import time
import xml.etree.ElementTree as ET
from pathlib import Path

PACKAGE = 'com.emmagh1.coby'
OUT = Path('artifacts')

def adb(*args):
    return subprocess.check_output(['adb', *args], timeout=180 if args[0] == 'install' else 20).decode(errors='replace')

def tree():
    adb('shell', 'uiautomator', 'dump', '--compressed', '/sdcard/coby-qa.xml')
    return ET.fromstring(adb('shell', 'cat', '/sdcard/coby-qa.xml'))

def locate(label):
    for node in tree().iter('node'):
        if label.casefold() in ((node.get('text') or '').casefold(), (node.get('content-desc') or '').casefold()):
            bounds = [int(x) for x in re.findall(r'\d+', node.get('bounds', ''))]
            if len(bounds) == 4 and bounds[2] > bounds[0] and bounds[3] > bounds[1]:
                return bounds
    return None

def tap(label, scroll=False):
    for _ in range(7 if scroll else 3):
        bounds = locate(label)
        if bounds:
            adb('shell', 'input', 'tap', str((bounds[0]+bounds[2])//2), str((bounds[1]+bounds[3])//2))
            time.sleep(1)
            return
        if scroll:
            adb('shell', 'input', 'swipe', '590', '1700', '590', '750', '350')
        time.sleep(1)
    raise RuntimeError(f'Visible control missing: {label}')

def expect(label):
    if not locate(label):
        raise RuntimeError(f'Expected screen/control missing: {label}')

def expect_selected(label):
    for _ in range(7):
        if locate(label):
            break
        adb('shell', 'input', 'swipe', '590', '1700', '590', '750', '350')
        time.sleep(1)
    matches = [node for node in tree().iter('node') if (node.get('content-desc') or '') == label]
    assert any(node.get('selected') == 'true' for node in matches), f'Selection missing: {label}'

def replace_title(value):
    tap('Item 1 title')
    adb('shell', 'input', 'keycombination', '113', '29')
    adb('shell', 'input', 'text', value.replace(' ', '%s'))
    adb('shell', 'input', 'keyevent', '4')

def type_dump(value):
    # Pace injected typing and wait for controlled TextInput to retain every word.
    for index, word in enumerate(value.split(' ')):
        adb('shell', 'input', 'text', ('%s' if index else '') + word)
        time.sleep(0.25)
    for _ in range(10):
        current = next((node.get('text', '') for node in tree().iter('node') if node.get('content-desc') == 'Brain dump'), None)
        if current == value:
            return
        time.sleep(1)
    raise RuntimeError(f'Synthetic input differs before Send: expected length {len(value)}, actual length {len(current or "")}')

def capture(name):
    data = subprocess.check_output(['adb', 'exec-out', 'screencap', '-p'])
    (OUT / f'{name}.png').write_bytes(data)

def main():
    assert adb('get-serialno').strip().startswith('emulator-'), 'Refusing to test on a real phone'
    OUT.mkdir(exist_ok=True)
    for setting in ('animator_duration_scale', 'transition_animation_scale', 'window_animation_scale'):
        adb('shell', 'settings', 'put', 'global', setting, '0')
    adb('shell', 'pm', 'grant', PACKAGE, 'android.permission.POST_NOTIFICATIONS')
    adb('shell', 'am', 'start', '-n', f'{PACKAGE}/.MainActivity')
    time.sleep(3)
    # This workflow installs into a fresh emulator with synthetic fixtures only.
    tap('Plan'); tap('Clear list', scroll=True); tap('Clear list')
    tap('Home')
    expect('Brain dump')
    capture('flow-empty-home')
    tap('Brain dump')
    dump = 'Finish the database assignment tomorrow, call Daniel by 8 PM tonight for 5 minutes, and buy data.'
    type_dump(dump)
    bounds = locate('Brain dump')
    keyboard = next((node for node in tree().iter('node') if (node.get('resource-id') or '').endswith('/keyboard_view')), None)
    if keyboard is not None:
        keyboard_top = [int(x) for x in re.findall(r'\d+', keyboard.get('bounds', ''))][1]
        assert bounds and bounds[3] <= keyboard_top, 'Composer is behind the keyboard'
    expect('Let Coby understand this')
    capture('flow-keyboard')
    adb('shell', 'input', 'keyevent', '4')
    tap('Let Coby understand this')
    expect('Item 1 title')
    capture('flow-receipt')
    for _ in range(7):
        if locate('Item 3 title'):
            break
        adb('shell', 'input', 'swipe', '590', '1700', '590', '750', '350')
    else:
        raise RuntimeError('Fixture did not produce three receipt items')
    capture('flow-receipt-last-item')
    for _ in range(3):
        adb('shell', 'input', 'swipe', '590', '750', '590', '1700', '350')
    # Reproduce the user's offscreen invalid-card case, rather than testing only one card.
    tap('Item 1 title')
    adb('shell', 'input', 'keycombination', '113', '29')
    adb('shell', 'input', 'keyevent', '67')
    adb('shell', 'input', 'keyevent', '4')
    tap('Looks right. Hold it.', scroll=True)
    expect('Give this a title, or go back and edit your dump.')
    bounds = locate('Item 1 title')
    assert bounds and bounds[1] < 1200, 'Blocked Hold did not return to the invalid card'
    capture('flow-receipt-error-jump')
    tap('Item 1 title')
    adb('shell', 'input', 'text', 'Finish%sthe%sdatabase%sassignment')
    adb('shell', 'input', 'keyevent', '4')
    tap('Looks right. Hold it.', scroll=True)
    expect('Start focus')
    capture('flow-held-home')
    # A paywall detour must preserve the edit, and Cancel must preserve the saved task.
    tap('Edit Call Daniel')
    replace_title('Call Daniel after lunch')
    tap('Reminder Off', scroll=True); expect_selected('Reminder Off')
    tap('Reminder Persistent'); expect('A little more support.'); capture('flow-paywall')
    adb('shell', 'input', 'keyevent', '4')
    for _ in range(3):
        adb('shell', 'input', 'swipe', '590', '750', '590', '1700', '350')
    expect('Item 1 title')
    title = next(node.get('text') for node in tree().iter('node') if node.get('content-desc') == 'Item 1 title')
    assert title == 'Call Daniel after lunch', 'Paywall return lost the unsaved title'
    expect_selected('Reminder Off'); capture('flow-edit-reminder')
    adb('shell', 'input', 'keyevent', '4')
    expect('Edit Call Daniel')
    tap('Edit Call Daniel')
    expect_selected('Reminder Gentle')
    tap('Reminder Off'); tap('Save changes', scroll=True)
    expect('No reminder')
    tap('Edit Call Daniel'); expect_selected('Reminder Off')
    adb('shell', 'input', 'keyevent', '4')
    tap('Start focus'); expect('End focus'); capture('flow-focus')
    adb('shell', 'input', 'keyevent', '4'); expect('Start focus')
    tap('Start focus'); expect('End focus')
    tap('Complete')
    tap('Plan'); expect('Calendar'); capture('flow-list')
    tap('Calendar'); expect('Next week'); capture('flow-calendar')
    tap('Completed · 1'); capture('flow-history')
    tap('Back to Held list'); tap('Clear list', scroll=True); tap('Clear list')
    expect('Completed · 1'); capture('flow-cleared-list')
    adb('shell', 'input', 'keyevent', '3')
    adb('shell', 'am', 'kill', PACKAGE)
    adb('shell', 'am', 'start', '-n', f'{PACKAGE}/.MainActivity')
    time.sleep(3)
    tap('Plan'); expect('Completed · 1')
    tap('Completed · 1'); capture('flow-restart-history')
    (OUT / 'native-flow.txt').write_text('PASS: synthetic keyboard-visible dump/three-item receipt/hold, offscreen error jump and correction, staged reminder Cancel/Save, paywall draft retention and Android Back, Focus exit/completion, List/Calendar, confirmed Clear list and completed history after cold restart.\n')

if __name__ == '__main__':
    try:
        main()
    except Exception:
        if adb('get-serialno').strip().startswith('emulator-'):
            OUT.mkdir(exist_ok=True)
            capture('flow-failure')
            try:
                (OUT / 'flow-failure.xml').write_text(ET.tostring(tree(), encoding='unicode'))
            except Exception:
                pass
        raise
