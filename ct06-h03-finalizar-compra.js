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

  await page.locator('#password').hover();
  await page.waitForTimeout(800);
  await page.locator('#password').fill('secret_sauce');

  await page.locator('#login-button').hover();
  await page.waitForTimeout(800);
  await page.locator('#login-button').click();
  await page.waitForTimeout(1500);

  // ADICIONAR PRODUTO
  const adicionarProduto = page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  );

  await adicionarProduto.hover();
  await page.waitForTimeout(800);
  await adicionarProduto.click();
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

  // PREENCHER DADOS
  await page.locator('[data-test="firstName"]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-test="firstName"]').fill('Keurliano');

  await page.locator('[data-test="lastName"]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-test="lastName"]').fill('Silva');

  await page.locator('[data-test="postalCode"]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-test="postalCode"]').fill('88000-000');

  await page.waitForTimeout(1200);

  // AVANÇAR PARA OVERVIEW
  await page.locator('[data-test="continue"]').hover();
  await page.waitForTimeout(1000);
  await page.locator('[data-test="continue"]').click();
  await page.waitForTimeout(2000);

  // CONFIRMAR OVERVIEW
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.locator('.title')).toHaveText(
    'Checkout: Overview'
  );

  // FINALIZAR COMPRA
  await page.locator('[data-test="finish"]').hover();
  await page.waitForTimeout(1000);
  await page.locator('[data-test="finish"]').click();
  await page.waitForTimeout(2000);

  // VALIDAR CONCLUSÃO
  await expect(page).toHaveURL(/checkout-complete\.html/);

  await expect(page.locator('.title')).toHaveText(
    'Checkout: Complete!'
  );

  await expect(page.locator('.complete-header')).toContainText(
    'Thank you for your order'
  );

  console.log('H03-CT06: PASSOU');

  await page.waitForTimeout(5000);

  await browser.close();
})();