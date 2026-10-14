const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Acessar o sistema
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Adicionar um produto ao carrinho
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Acessar o carrinho
  await page.locator('.shopping_cart_link').click();

  // Iniciar checkout
  await page.locator('[data-test="checkout"]').click();

  // Preencher os dados obrigatórios
  await page.locator('[data-test="firstName"]').fill('Keurliano');
  await page.locator('[data-test="lastName"]').fill('Teste');
  await page.locator('[data-test="postalCode"]').fill('88000-000');

  // Avançar para o Overview
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  // Finalizar a compra
  await page.locator('[data-test="finish"]').click();

  // Confirmar que a compra foi concluída
  await expect(page).toHaveURL(/checkout-complete\.html/);

  // Voltar para a tela inicial
  await page.locator('[data-test="back-to-products"]').click();

  // Verificar se retornou para a página de produtos
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  console.log('H03-CT09: PASSOU');

  await page.waitForTimeout(3000);

  await browser.close();
})();