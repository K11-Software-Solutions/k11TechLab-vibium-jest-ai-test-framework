from pathlib import Path
import os

from vibium import browser

url = os.getenv("K11_URL", "https://selenium.dev")
artifacts_dir = Path("artifacts/screenshots")
home_shot = artifacts_dir / "selenium-home-python.png"

artifacts_dir.mkdir(parents=True, exist_ok=True)

bro = browser.start()

try:
    page = bro.page()
    page.go(url)

    png = page.screenshot(full_page=False, clip={"x": 0, "y": 0, "width": 400, "height": 300})
    home_shot.write_bytes(png)

    print(f"[vibium-demo] Python smoke check completed for {url}")
    print(f"[vibium-demo] Screenshot saved: {home_shot}")
finally:
    bro.stop()
