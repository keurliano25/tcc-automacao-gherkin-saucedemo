const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Informar credenciais válidas
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Realizar login
  await page.locator('#login-button').click();

  // Verificar acesso à área de produtos
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  console.log('C1-E2-H01-CT06: PASSOU');

  await page.waitForTimeout(3000);

  await browser.close();
})();