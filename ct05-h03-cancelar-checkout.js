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

  // CONFIRMAR QUE ESTAMOS NO CARRINHO
  await expect(page).toHaveURL(/cart\.html/);

  // IR PARA CHECKOUT
  const checkout = page.locator('[data-test="checkout"]');

  await checkout.hover();
  await page.waitForTimeout(1000);
  await checkout.click();
  await page.waitForTimeout(2000);

  // CONFIRMAR QUE ESTAMOS NA TELA DE INFORMAÇÕES DO CHECKOUT
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('.title')).toHaveText(
    'Checkout: Your Information'
  );

  // CANCELAR CHECKOUT
  const cancelar = page.locator('[data-test="cancel"]');

  await cancelar.hover();
  await page.waitForTimeout(1000);
  await cancelar.click();
  await page.waitForTimeout(2000);

  // VALIDAR RETORNO PARA PRODUTOS
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  console.log('H03-CT05: PASSOU');

  await page.waitForTimeout(5000);

  await browser.close();
})();