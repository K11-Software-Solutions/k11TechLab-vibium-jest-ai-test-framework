from vibium import browser

url = "https://example.com"

bro = browser.start()
try:
    page = bro.page()
    page.go(url)
    png = page.screenshot(full_page=False, clip={"x": 0, "y": 0, "width": 400, "height": 300})
    from pathlib import Path
    artifacts_dir = Path("artifacts")
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    test_shot = artifacts_dir / "vibium-test-python.png"
    test_shot.write_bytes(png)
    print("[vibium-demo] Screenshot saved:", test_shot)
    print("[vibium-demo] Browser launched and navigated to example.com")
finally:
    bro.stop()
    print("[vibium-demo] Browser stopped.")
