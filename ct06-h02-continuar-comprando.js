const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Realiza o login.
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Adiciona um produto ao carrinho.
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Acessa o carrinho.
  await page.locator('.shopping_cart_link').click();

  // Clica em "Continue Shopping".
  await page.locator('[data-test="continue-shopping"]').click();

  // Verifica se retornou para a página de produtos.
  await expect(page).toHaveURL(/inventory\.html/);

  // Confirma que a página de produtos foi carregada.
  await expect(page.locator('.title')).toHaveText('Products');

  console.log('H02-CT06: PASSOU');

  await browser.close();
})();