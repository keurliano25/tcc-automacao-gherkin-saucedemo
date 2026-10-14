const { chromium } = require('@playwright/test');

const URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function iniciar() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  return browser;
}

async function login(page) {
  await page.goto(URL);

  await page.locator('#user-name').fill(USERNAME);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('#login-button').click();

  await page.waitForURL('**/inventory.html');
  await page.locator('.inventory_list').waitFor();
}

async function adicionarProduto(page, produto) {
  await page.locator(`[data-test="add-to-cart-${produto}"]`).click();
}

async function acessarCarrinho(page) {
  await page.locator('.shopping_cart_link').click();
  await page.waitForURL('**/cart.html');
  await page.locator('.cart_list').waitFor();
}

async function prepararCheckout(page) {
  await login(page);

  await adicionarProduto(page, 'sauce-labs-backpack');

  await acessarCarrinho(page);

  await page.locator('[data-test="checkout"]').click();

  await page.waitForURL('**/checkout-step-one.html');
  await page.locator('.checkout_info').waitFor();
}

async function preencherDadosCheckout(page) {
  await page.locator('[data-test="firstName"]').fill('Keurliano');
  await page.locator('[data-test="lastName"]').fill('Teste');
  await page.locator('[data-test="postalCode"]').fill('88000-000');
}


// ============================================================
// C2-H03-CT01
// RN15 / SC14
// Impedir avanço sem informar First Name
// ============================================================

async function CT01() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await page.locator('[data-test="lastName"]').fill('Teste');
    await page.locator('[data-test="postalCode"]').fill('88000-000');

    await page.locator('[data-test="continue"]').click();

    const erro = page.locator('[data-test="error"]');

    await erro.waitFor();

    const mensagem = await erro.textContent();

    if (!mensagem.toLowerCase().includes('first name')) {
      throw new Error(
        `Mensagem esperada relacionada ao First Name. Obtida: ${mensagem}`
      );
    }

    console.log('C2-H03-CT01: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT01: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT02
// RN16 / SC15
// Impedir avanço sem informar Last Name
// ============================================================

async function CT02() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await page.locator('[data-test="firstName"]').fill('Keurliano');
    await page.locator('[data-test="postalCode"]').fill('88000-000');

    await page.locator('[data-test="continue"]').click();

    const erro = page.locator('[data-test="error"]');

    await erro.waitFor();

    const mensagem = await erro.textContent();

    if (!mensagem.toLowerCase().includes('last name')) {
      throw new Error(
        `Mensagem esperada relacionada ao Last Name. Obtida: ${mensagem}`
      );
    }

    console.log('C2-H03-CT02: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT02: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT03
// RN17 / SC16
// Impedir avanço sem informar Postal Code
// ============================================================

async function CT03() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await page.locator('[data-test="firstName"]').fill('Keurliano');
    await page.locator('[data-test="lastName"]').fill('Teste');

    await page.locator('[data-test="continue"]').click();

    const erro = page.locator('[data-test="error"]');

    await erro.waitFor();

    const mensagem = await erro.textContent();

    if (!mensagem.toLowerCase().includes('postal code')) {
      throw new Error(
        `Mensagem esperada relacionada ao Postal Code. Obtida: ${mensagem}`
      );
    }

    console.log('C2-H03-CT03: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT03: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT04
// RN18 / RN20 / SC17
// Avançar para Checkout Overview
// ============================================================

async function CT04() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await preencherDadosCheckout(page);

    await page.locator('[data-test="continue"]').click();

    await page.waitForURL('**/checkout-step-two.html');

    const titulo = await page.locator('.title').textContent();

    if (titulo.trim() !== 'Checkout: Overview') {
      throw new Error(
        `Título esperado: Checkout: Overview. Obtido: ${titulo}`
      );
    }

    console.log('C2-H03-CT04: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT04: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT05
// RN19 / SC18
// Cancelar preenchimento do checkout
// ============================================================

async function CT05() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await preencherDadosCheckout(page);

    await page.locator('[data-test="cancel"]').click();

    await page.waitForURL('**/cart.html');

    const urlAtual = page.url();

    if (!urlAtual.includes('/cart.html')) {
      throw new Error(
        `Retorno esperado para o carrinho. URL obtida: ${urlAtual}`
      );
    }

    console.log('C2-H03-CT05: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT05: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT06
// RN21 / RN22 / SC19
// Finalizar compra e apresentar confirmação
// ============================================================

async function CT06() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await preencherDadosCheckout(page);

    await page.locator('[data-test="continue"]').click();

    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();

    await page.waitForURL('**/checkout-complete.html');

    const titulo = await page.locator('.title').textContent();

    if (titulo.trim() !== 'Checkout: Complete!') {
      throw new Error(
        `Título esperado: Checkout: Complete!. Obtido: ${titulo}`
      );
    }

    const mensagem = await page
      .locator('.complete-header')
      .textContent();

    if (!mensagem.toLowerCase().includes('thank you')) {
      throw new Error(
        `Mensagem de confirmação não encontrada. Obtida: ${mensagem}`
      );
    }

    console.log('C2-H03-CT06: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT06: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT07
// RN23 / SC20
// Retornar à página de produtos após conclusão
// ============================================================

async function CT07() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await preencherDadosCheckout(page);

    await page.locator('[data-test="continue"]').click();

    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();

    await page.waitForURL('**/checkout-complete.html');

    const voltar = page.locator('[data-test="back-to-products"]');

    await voltar.click();

    await page.waitForURL('**/inventory.html');

    const titulo = await page.locator('.title').textContent();

    if (titulo.trim() !== 'Products') {
      throw new Error(
        `Título esperado: Products. Obtido: ${titulo}`
      );
    }

    console.log('C2-H03-CT07: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT07: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H03-CT08
// RN24 / SC21
// Gerar e baixar PDF do pedido
// ============================================================

async function CT08() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await prepararCheckout(page);

    await preencherDadosCheckout(page);

    await page.locator('[data-test="continue"]').click();

    await page.waitForURL('**/checkout-step-two.html');

    await page.locator('[data-test="finish"]').click();

    await page.waitForURL('**/checkout-complete.html');

    const botaoPDF = page.locator('#generate-pdf-order');

    await botaoPDF.waitFor();

    const downloadPromise = page.waitForEvent('download');

    await botaoPDF.click();

    const download = await downloadPromise;

    const nomeArquivo = download.suggestedFilename();

    if (!nomeArquivo.toLowerCase().endsWith('.pdf')) {
      throw new Error(
        `Arquivo esperado em formato PDF. Obtido: ${nomeArquivo}`
      );
    }

    console.log('C2-H03-CT08: PASSOU');
  } catch (erro) {
    console.log('C2-H03-CT08: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// EXECUÇÃO DOS 8 TESTES
// ============================================================

async function executarTestes() {
  await CT01();
  await CT02();
  await CT03();
  await CT04();
  await CT05();
  await CT06();
  await CT07();
  await CT08();
}

executarTestes();