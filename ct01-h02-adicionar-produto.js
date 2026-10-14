const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Realiza o login.
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Adiciona o produto ao carrinho.
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Verifica se o contador do carrinho foi atualizado para 1.
  const contadorCarrinho = page.locator('.shopping_cart_badge');

  await expect(contadorCarrinho).toHaveText('1');

  console.log('H02-CT01: PASSOU');

  await browser.close();
})();