const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/ajay anthwal/.cache/puppeteer/chrome/win64-156.0.8078.47/chrome-win64/chrome.exe',
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('response', res => {
    if (res.status() >= 300 && res.status() < 400) {
      console.log('REDIRECT:', res.status(), res.url(), '->', res.headers()['location']);
    }
  });

  console.log('Navigating to http://localhost:3000 ...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log('Goto error/timeout:', e.message);
  }

  console.log('Final URL:', page.url());
  try {
    const title = await page.title();
    console.log('Page Title:', title);
  } catch (e) {}

  await page.screenshot({ path: 'browser_homepage.png', fullPage: true });
  console.log('Screenshot saved to browser_homepage.png');

  await browser.close();
})();
