const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  console.log('Página carregada:', await page.title());

  await page.waitForTimeout(3000);

  await browser.close();
})();