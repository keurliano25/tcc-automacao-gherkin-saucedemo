const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Preenche o Username.
  // A Password permanece vazia.
  await page.locator('#user-name').fill('standard_user');

  // Tenta realizar o login.
  await page.locator('#login-button').click();

  // Localiza a mensagem de erro.
  const mensagem = page.locator('[data-test="error"]');

  // Valida o resultado esperado pelo cenário.
  await expect(mensagem).toContainText('Password is required');

  console.log('CT02: PASSOU');

  await browser.close();
})();