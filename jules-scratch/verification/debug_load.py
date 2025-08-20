from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Listen for console events and print them
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    try:
        page.goto("http://localhost:8080", wait_until="networkidle")
        page.wait_for_timeout(5000) # Wait 5 seconds to see if anything changes
        page.screenshot(path="jules-scratch/verification/debug_view.png")
    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_view.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
