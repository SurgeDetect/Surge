import json
import sys

from playwright.sync_api import sync_playwright


url = sys.argv[1] if len(sys.argv) > 1 else "https://surgedetect.com/"
results = []

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in (("desktop", 1440, 1000), ("mobile", 375, 812)):
        errors = []
        page = browser.new_page(viewport={"width": width, "height": height})
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        response = page.goto(url, wait_until="networkidle")
        body = page.locator("body").inner_text()

        assert response is not None and response.status == 200
        assert page.title() == "Surge"
        assert "Most spikes" in body
        assert "Surge launches on Pump.fun." in body
        assert "CA:PENDING" in body
        assert page.locator('[data-testid="contract-status"]').count() == 1
        assert page.locator('a[href="https://github.com/SurgeDetect/Surge"][target="_blank"]').count() == 3
        assert page.locator('a[href="https://x.com/SurgeOnSOLL"][target="_blank"]').count() == 2
        assert page.locator('[aria-label="Open Surge on X"]').count() == 1
        assert page.locator('img[src="/surge-mark.webp"][aria-hidden="true"]').count() == 1
        assert page.locator('link[rel="icon"][href="/favicon.png"]').count() == 1
        assert page.get_by_role("link", name="Launch App").get_attribute("href") == "#board"
        assert page.locator('a[href="https://pump.fun/"][target="_blank"]').count() == 1
        scroll_width = page.evaluate("document.documentElement.scrollWidth")
        client_width = page.evaluate("document.documentElement.clientWidth")
        assert scroll_width == client_width, f"{name}: scrollWidth={scroll_width}, clientWidth={client_width}"
        assert not errors

        results.append({"viewport": name, "status": response.status, "title": page.title(), "console_errors": len(errors), "horizontal_overflow": False})
        page.close()
    browser.close()

print(json.dumps(results, indent=2))
