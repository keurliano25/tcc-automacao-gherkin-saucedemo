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

  // Adicionar um produto
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Acessar o carrinho
  await page.locator('.shopping_cart_link').click();

  // Iniciar checkout
  await page.locator('[data-test="checkout"]').click();

  // Preencher informações obrigatórias
  await page.locator('[data-test="firstName"]').fill('Keurliano');
  await page.locator('[data-test="lastName"]').fill('Teste');
  await page.locator('[data-test="postalCode"]').fill('88000-000');

  // Avançar para o Overview
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  // Finalizar a compra
  await page.locator('[data-test="finish"]').click();

  // Confirmar que chegou à página de conclusão
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.locator('.complete-header')).toContainText('Thank you for your order');

  // Localizar o recurso de PDF
  const pdfLink = page.getByText(/PDF/i).first();

  await expect(pdfLink).toBeVisible();

  console.log('Recurso de PDF encontrado.');

  // Aguardar o download
  const downloadPromise = page.waitForEvent('download');

  await pdfLink.click();

  const download = await downloadPromise;

  // Salvar o arquivo
  const nomeArquivo = download.suggestedFilename();

  await download.saveAs(nomeArquivo);

  console.log(`Arquivo gerado: ${nomeArquivo}`);
  console.log('Arquivo PDF salvo com sucesso.');

  console.log('H03-CT10: PASSOU');

  await page.waitForTimeout(3000);

  await browser.close();
})();