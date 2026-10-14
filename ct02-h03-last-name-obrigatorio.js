const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');
  await page.waitForTimeout(1500);

  // LOGIN
  await page.locator('#user-name').hover();
  await page.waitForTimeout(800);
  await page.locator('#user-name').fill('standard_user');
  await page.waitForTimeout(800);

  await page.locator('#password').hover();
  await page.waitForTimeout(800);
  await page.locator('#password').fill('secret_sauce');
  await page.waitForTimeout(800);

  await page.locator('#login-button').hover();
  await page.waitForTimeout(800);
  await page.locator('#login-button').click();
  await page.waitForTimeout(1500);

  // ADICIONAR PRODUTO AO CARRINHO
  await page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  ).hover();

  await page.waitForTimeout(800);

  await page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  ).click();

  await page.waitForTimeout(1200);

  // CARRINHO
  await page.locator('.shopping_cart_link').hover();
  await page.waitForTimeout(800);
  await page.locator('.shopping_cart_link').click();
  await page.waitForTimeout(1500);

  // CHECKOUT
  await page.locator('[data-test="checkout"]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-test="checkout"]').click();
  await page.waitForTimeout(1500);

  // PREENCHIMENTO
  // Last Name permanece vazio

  await page.locator('[data-test="firstName"]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-test="firstName"]').fill('Keurliano');
  await page.waitForTimeout(800);

  await page.locator('[data-test="postalCode"]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-test="postalCode"]').fill('88000-000');
  await page.waitForTimeout(1200);

  // CONTINUE
  await page.locator('[data-test="continue"]').hover();
  await page.waitForTimeout(1000);
  await page.locator('[data-test="continue"]').click();
  await page.waitForTimeout(1500);

  // VALIDAÇÃO
  const mensagem = page.locator('[data-test="error"]');

  await expect(mensagem).toContainText(
    'Error: Last Name is required'
  );

  console.log('H03-CT02: PASSOU');

  await page.waitForTimeout(5000);

  await browser.close();
})();