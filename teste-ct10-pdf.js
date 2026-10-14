const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Iniciando CT10...');

    // Login
    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Adicionar produto
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    ).click();

    await page.locator('.shopping_cart_link').click();

    // Checkout
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Keurliano');
    await page.locator('[data-test="lastName"]').fill('Silva');
    await page.locator('[data-test="postalCode"]').fill('88000-000');

    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(
      /checkout-step-two\.html/
    );

    // Finalizar compra
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(
      /checkout-complete\.html/
    );

    console.log('Compra finalizada.');

    // ============================================================
    // CT10 - Gerar e baixar o PDF do pedido
    // ============================================================

    const botaoPDF = page.locator('#generate-pdf-order');

    await expect(botaoPDF).toBeVisible();

    console.log('Botão "Generate PDF order" encontrado.');

    // Aguarda o evento de download enquanto clica no botão.
    const downloadPromise = page.waitForEvent('download');

    await botaoPDF.click();

    const download = await downloadPromise;

    console.log('Download detectado.');

    const nomeArquivo = download.suggestedFilename();

    console.log(`Arquivo gerado: ${nomeArquivo}`);

    const caminho = await download.path();

    if (!caminho) {
      throw new Error(
        'O download foi iniciado, mas o arquivo não ficou disponível.'
      );
    }

    console.log(`Arquivo salvo temporariamente em: ${caminho}`);

    console.log('CT10: PASSOU');

    await page.waitForTimeout(3000);

  } catch (erro) {
    console.log('CT10: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
})();