const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage();

  // Abre o SauceDemo.
  await page.goto('https://www.saucedemo.com/');
  await page.waitForTimeout(1500);

  // ==============================
  // LOGIN
  // ==============================

  // Move o mouse até o campo Username.
  await page.locator('#user-name').hover();
  await page.waitForTimeout(800);

  // Preenche o Username.
  await page.locator('#user-name').fill('standard_user');
  await page.waitForTimeout(800);

  // Move o mouse até o campo Password.
  await page.locator('#password').hover();
  await page.waitForTimeout(800);

  // Preenche a Password.
  await page.locator('#password').fill('secret_sauce');
  await page.waitForTimeout(800);

  // Move o mouse até o botão de login.
  await page.locator('#login-button').hover();
  await page.waitForTimeout(800);

  // Realiza o login.
  await page.locator('#login-button').click();
  await page.waitForTimeout(1500);

  // ==============================
  // CARRINHO
  // ==============================

  // Move o mouse até o produto.
  await page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  ).hover();
  await page.waitForTimeout(800);

  // Adiciona o produto ao carrinho.
  await page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  ).click();
  await page.waitForTimeout(1200);

  // Move o mouse até o carrinho.
  await page.locator('.shopping_cart_link').hover();
  await page.waitForTimeout(800);

  // Acessa o carrinho.
  await page.locator('.shopping_cart_link').click();
  await page.waitForTimeout(1500);

  // ==============================
  // CHECKOUT
  // ==============================

  // Move o mouse até o botão Checkout.
  await page.locator('[data-test="checkout"]').hover();
  await page.waitForTimeout(800);

  // Acessa o checkout.
  await page.locator('[data-test="checkout"]').click();
  await page.waitForTimeout(1500);

  // ==============================
  // PREENCHIMENTO
  // ==============================

  // O First Name permanece vazio.

  // Move o mouse até Last Name.
  await page.locator('[data-test="lastName"]').hover();
  await page.waitForTimeout(800);

  // Preenche o Last Name.
  await page.locator('[data-test="lastName"]').fill('Silva');
  await page.waitForTimeout(800);

  // Move o mouse até Postal Code.
  await page.locator('[data-test="postalCode"]').hover();
  await page.waitForTimeout(800);

  // Preenche o Postal Code.
  await page.locator('[data-test="postalCode"]').fill('88000-000');
  await page.waitForTimeout(1200);

  // ==============================
  // TENTATIVA DE CONTINUAR
  // ==============================

  // Move o mouse até o botão Continue.
  await page.locator('[data-test="continue"]').hover();
  await page.waitForTimeout(1000);

  // Tenta continuar o checkout.
  await page.locator('[data-test="continue"]').click();
  await page.waitForTimeout(1500);

  // ==============================
  // VALIDAÇÃO
  // ==============================

  // Localiza a mensagem de erro.
  const mensagem = page.locator('[data-test="error"]');

  // Valida que o First Name é obrigatório.
  await expect(mensagem).toContainText(
    'Error: First Name is required'
  );

  console.log('H03-CT01: PASSOU');

  // Mantém a tela aberta por mais tempo para visualização.
  await page.waitForTimeout(5000);

  await browser.close();
})();