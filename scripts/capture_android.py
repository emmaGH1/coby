"""Capture the real fixture-powered Android Home screen for submission review."""
import struct
import subprocess
import time
from pathlib import Path


def adb(*args: str, capture: bool = False) -> bytes:
    result = subprocess.run(["adb", *args], check=True, stdout=subprocess.PIPE if capture else subprocess.DEVNULL)
    return result.stdout if capture else b""

def main() -> None:
    adb("shell", "wm", "size", "1179x2556")
    adb("shell", "wm", "density", "440")
    adb("install", "android/app/build/outputs/apk/release/app-release.apk")
    adb("shell", "am", "start", "-n", "com.emmagh1.coby/.MainActivity")
    time.sleep(12)
    time.sleep(4)
    output = Path("artifacts/screenshot-home.png")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(adb("exec-out", "screencap", "-p", capture=True))
    data = output.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise RuntimeError("Android did not return a PNG")
    width, height = struct.unpack(">II", data[16:24])
    if (width, height) != (1179, 2556):
        raise RuntimeError(f"Wrong screenshot size: {width}x{height}")
    print(f"Captured real Coby Home screen: {width}x{height}")


if __name__ == "__main__":
    main()
