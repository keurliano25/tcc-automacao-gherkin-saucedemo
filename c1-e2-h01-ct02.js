const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Acessar a tela de login
  await page.goto('https://www.saucedemo.com/');

  // Informar somente o Username
  await page.locator('#user-name').fill('standard_user');

  // Tentar realizar o login sem informar Password
  await page.locator('#login-button').click();

  // Verificar a mensagem esperada
  const mensagem = page.locator('[data-test="error"]');

  await expect(mensagem).toContainText('Password is required');

  console.log('C1-E2-H01-CT02: PASSOU');

  await page.waitForTimeout(3000);

  await browser.close();
})();