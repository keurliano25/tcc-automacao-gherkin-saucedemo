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

  // Clica em "Checkout".
  await page.locator('[data-test="checkout"]').click();

  // Verifica se a tela de informações do checkout foi carregada.
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // Confirma o título da página.
  await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

  console.log('H02-CT07: PASSOU');

  await browser.close();
})();