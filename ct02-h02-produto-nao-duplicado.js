const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Realiza o login.
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Localiza o botão de adicionar o produto.
  const botaoAdicionar = page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  );

  // Adiciona o produto ao carrinho pela primeira vez.
  await botaoAdicionar.click();

  // Verifica que o carrinho possui uma unidade.
  const contadorCarrinho = page.locator('.shopping_cart_badge');
  await expect(contadorCarrinho).toHaveText('1');

  // Após a adição, o botão "Add to cart" deve deixar de existir.
  await expect(botaoAdicionar).toHaveCount(0);

  // O botão do produto deve passar a ser "Remove".
  const botaoRemover = page.locator(
    '[data-test="remove-sauce-labs-backpack"]'
  );

  await expect(botaoRemover).toHaveCount(1);

  // Acessa o carrinho.
  await page.locator('.shopping_cart_link').click();

  // Verifica que existe somente uma unidade do produto.
  const produto = page.locator('.cart_item');

  await expect(produto).toHaveCount(1);
  await expect(produto.locator('.cart_quantity')).toHaveText('1');

  // Confirma que o contador continua indicando apenas um produto.
  await expect(contadorCarrinho).toHaveText('1');

  console.log('H02-CT02: PASSOU');

  await browser.close();
})();