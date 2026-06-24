const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 800, height: 480 },
    deviceScaleFactor: 2
  });

  await page.goto('https://rahalb.github.io/egmed/', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for the page to settle, no selector needed
  await page.waitForTimeout(3000);

  await page.screenshot({
    path: 'clinic-hours.png',
    fullPage: false
  });

  await browser.close();
})();
