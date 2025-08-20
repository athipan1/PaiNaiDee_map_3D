from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        page.goto("http://localhost:8080", wait_until="networkidle")
        # Wait for either the welcome overlay or the main map container to be ready
        page.wait_for_selector('.welcome-overlay, #mapContainer', state='visible', timeout=10000)
        # Add an extra delay for animations to settle
        page.wait_for_timeout(2000)
        page.screenshot(path="jules-scratch/verification/initial_view.png")
    except Exception as e:
        print(f"An error occurred: {e}")
        # Take a screenshot even on error to see the state
        page.screenshot(path="jules-scratch/verification/error_view.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
