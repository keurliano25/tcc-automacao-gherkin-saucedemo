const { chromium } = require('@playwright/test');

(async () => {
  // headless: false -> abre o navegador visível
  // slowMo -> atrasa cada ação (ms) para dar para acompanhar na tela
  const browser = await chromium.launch({ headless: false, slowMo: 300 });

  let context;
  let page;

  const username = 'standard_user';
  const password = 'secret_sauce';

  // Cria um navegador "zerado" (sem carrinho, sem cookies) a cada teste
  async function novaSessao() {
    if (context) await context.close();
    context = await browser.newContext();
    page = await context.newPage();
  }

  async function login() {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();

    await page.waitForURL('**/inventory.html');
    await page.locator('.inventory_list').waitFor({ state: 'visible' });
  }

  async function prepararCheckout() {
    await novaSessao(); // sempre começa limpo
    await login();

    // Adiciona o produto ao carrinho
    await page
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    // Acessa o carrinho
    await page.locator('.shopping_cart_link').click();
    await page.waitForURL('**/cart.html');

    // Acessa o checkout
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');
  }

  // Preenche o formulário; passe null para deixar o campo em branco
  async function preencherDados(firstName, lastName, postalCode) {
    if (firstName !== null) {
      await page.locator('[data-test="firstName"]').fill(firstName);
    }
    if (lastName !== null) {
      await page.locator('[data-test="lastName"]').fill(lastName);
    }
    if (postalCode !== null) {
      await page.locator('[data-test="postalCode"]').fill(postalCode);
    }
  }

  // ============================================================
  // CT01 - Impedir avanço sem informar o First Name
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados(null, 'Teste', '88000-000');
    await page.locator('[data-test="continue"]').click();

    const erro = await page.locator('[data-test="error"]').textContent();

    if (erro && erro.toLowerCase().includes('first name')) {
      console.log('C1-E3-H03-CT01: PASSOU');
    } else {
      console.log('C1-E3-H03-CT01: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT01: FALHOU -', error.message);
  }

  // ============================================================
  // CT02 - Impedir avanço sem informar o Last Name
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', null, '88000-000');
    await page.locator('[data-test="continue"]').click();

    const erro = await page.locator('[data-test="error"]').textContent();

    if (erro && erro.toLowerCase().includes('last name')) {
      console.log('C1-E3-H03-CT02: PASSOU');
    } else {
      console.log('C1-E3-H03-CT02: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT02: FALHOU -', error.message);
  }

  // ============================================================
  // CT03 - Impedir avanço sem informar o Postal Code
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', null);
    await page.locator('[data-test="continue"]').click();

    const erro = await page.locator('[data-test="error"]').textContent();

    if (erro && erro.toLowerCase().includes('postal code')) {
      console.log('C1-E3-H03-CT03: PASSOU');
    } else {
      console.log('C1-E3-H03-CT03: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT03: FALHOU -', error.message);
  }

  // ============================================================
  // CT04 - Avançar para Checkout Overview
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');

    const titulo = await page.locator('.title').textContent();

    if (titulo && titulo.trim() === 'Checkout: Overview') {
      console.log('C1-E3-H03-CT04: PASSOU');
    } else {
      console.log('C1-E3-H03-CT04: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT04: FALHOU -', error.message);
  }

  // ============================================================
  // CT05 - Cancelar preenchimento das informações do checkout
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="cancel"]').click();
    await page.waitForLoadState('load');

    const url = page.url();
    const titulo = await page.locator('.title').textContent();

    // O gabarito estabelece que o cancelamento deve retornar
    // para a página de produtos.
    // OBS: no SauceDemo real, o Cancel volta para o carrinho (cart.html).
    if (
      url.includes('inventory.html') &&
      titulo &&
      titulo.trim() === 'Products'
    ) {
      console.log('C1-E3-H03-CT05: PASSOU');
    } else {
      console.log(
        'C1-E3-H03-CT05: FALHOU - retorno diferente do esperado:',
        url
      );
    }
  } catch (error) {
    console.log('C1-E3-H03-CT05: FALHOU -', error.message);
  }

  // ============================================================
  // CT06 - Apresentar Checkout Overview antes da finalização
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');

    const titulo = await page.locator('.title').textContent();
    const finishButton = await page.locator('[data-test="finish"]').count();

    if (
      titulo &&
      titulo.trim() === 'Checkout: Overview' &&
      finishButton > 0
    ) {
      console.log('C1-E3-H03-CT06: PASSOU');
    } else {
      console.log('C1-E3-H03-CT06: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT06: FALHOU -', error.message);
  }

  // ============================================================
  // CT07 - Finalizar a compra
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');

    const url = page.url();

    if (url.includes('checkout-complete.html')) {
      console.log('C1-E3-H03-CT07: PASSOU');
    } else {
      console.log('C1-E3-H03-CT07: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT07: FALHOU -', error.message);
  }

  // ============================================================
  // CT08 - Apresentar confirmação de conclusão da compra
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');

    const titulo = await page.locator('.title').textContent();
    const mensagem = await page.locator('.complete-header').textContent();

    if (
      titulo &&
      titulo.trim() === 'Checkout: Complete!' &&
      mensagem &&
      mensagem.toLowerCase().includes('thank you')
    ) {
      console.log('C1-E3-H03-CT08: PASSOU');
    } else {
      console.log('C1-E3-H03-CT08: FALHOU - título:', titulo);
    }
  } catch (error) {
    console.log('C1-E3-H03-CT08: FALHOU -', error.message);
  }

  // ============================================================
  // CT09 - Retornar à página de produtos após concluir a compra
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');

    await page.locator('[data-test="back-to-products"]').click();
    await page.waitForURL('**/inventory.html');

    const url = page.url();
    const titulo = await page.locator('.title').textContent();

    if (
      url.includes('inventory.html') &&
      titulo &&
      titulo.trim() === 'Products'
    ) {
      console.log('C1-E3-H03-CT09: PASSOU');
    } else {
      console.log('C1-E3-H03-CT09: FALHOU');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT09: FALHOU -', error.message);
  }

  // ============================================================
  // CT10 - Gerar e baixar o PDF do pedido
  // ============================================================
  try {
    await prepararCheckout();

    await preencherDados('Teste', 'Usuario', '88000-000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');

    // OBS: o SauceDemo não possui botão de gerar PDF.
    // Timeout curto para não esperar 30s por algo que não existe.
    const botaoPDF = page.locator('#generate-pdf-order');
    await botaoPDF.waitFor({ state: 'visible', timeout: 5000 });

    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await botaoPDF.click();
    const download = await downloadPromise;

    const nomeArquivo = download.suggestedFilename();

    if (nomeArquivo.toLowerCase().endsWith('.pdf')) {
      console.log('C1-E3-H03-CT10: PASSOU - arquivo:', nomeArquivo);
    } else {
      console.log('C1-E3-H03-CT10: FALHOU - arquivo não é PDF');
    }
  } catch (error) {
    console.log('C1-E3-H03-CT10: FALHOU -', error.message);
  }

  if (context) await context.close();
  await browser.close();
})();