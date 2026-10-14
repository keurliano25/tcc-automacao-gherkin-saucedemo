const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Informa credenciais válidas.
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Realiza o login.
  await page.locator('#login-button').click();

  // Valida o redirecionamento para a página de produtos.
  await expect(page).toHaveURL(/inventory\.html/);

  // Confirma que a página de produtos foi carregada.
  await expect(page.locator('.title')).toHaveText('Products');

  console.log('CT06: PASSOU');

  await browser.close();
})();