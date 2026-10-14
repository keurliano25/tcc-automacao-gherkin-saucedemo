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

  // Acessa o carrinho.
  await page.locator('.shopping_cart_link').click();

  // Localiza o produto no carrinho.
  const produto = page.locator('.cart_item');

  // Verifica se existe exatamente um produto.
  await expect(produto).toHaveCount(1);

  // Verifica o nome do produto.
  await expect(produto.locator('.inventory_item_name'))
    .toHaveText('Sauce Labs Backpack');

  // Verifica a quantidade.
  await expect(produto.locator('.cart_quantity'))
    .toHaveText('1');

  // Verifica o preço.
  await expect(produto.locator('.inventory_item_price'))
    .toHaveText('$29.99');

  console.log('H02-CT03: PASSOU');

  await browser.close();
})();