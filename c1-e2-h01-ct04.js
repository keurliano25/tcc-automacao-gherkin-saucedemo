const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('senha_incorreta');
  await page.locator('#login-button').click();

  const mensagem = page.locator('[data-test="error"]');

  await expect(mensagem).toContainText(
    'Username and password do not match any user in this service'
  );

  console.log('C1-E2-H01-CT04: PASSOU');

  await page.waitForTimeout(3000);

  await browser.close();
})();