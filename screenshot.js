const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 800, height: 480 },
    deviceScaleFactor: 2
  });

  await page.goto('https://rahalb.github.io/egmed/clinic-hours-source.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForSelector('.title', { timeout: 60000 });

  await page.locator('.page').screenshot({
    path: 'clinic-hours.png'
  });

  await browser.close();
})();
