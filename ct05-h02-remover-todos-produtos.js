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

  // Remove o produto.
  await page.locator(
    '[data-test="remove-sauce-labs-backpack"]'
  ).click();

  // Verifica se o carrinho ficou vazio.
  await expect(page.locator('.cart_item')).toHaveCount(0);

  // Verifica se o contador do carrinho desapareceu.
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

  console.log('H02-CT05: PASSOU');

  await browser.close();
})();