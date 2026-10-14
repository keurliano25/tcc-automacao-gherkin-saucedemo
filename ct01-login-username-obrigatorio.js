const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // O Username permanece vazio.
  // Preenchemos apenas a Password.
  await page.locator('#password').fill('secret_sauce');

  // Tenta realizar o login.
  await page.locator('#login-button').click();

  // Localiza a mensagem de erro.
  const mensagem = page.locator('[data-test="error"]');

  // Valida o resultado esperado pelo cenário.
  await expect(mensagem).toContainText('Username is required');

  console.log('CT01: PASSOU');

  await browser.close();
})();