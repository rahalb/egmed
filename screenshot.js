const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 800, height: 480 },
    deviceScaleFactor: 1
  });

  await page.goto('https://rahalb.github.io/egmed/clinic-hours-source.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForSelector('#clinic_name', { timeout: 60000 });

  await page.screenshot({
    path: 'clinic-hours.png',
    fullPage: false
  });

  await browser.close();
})();
