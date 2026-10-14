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


// ============================================================
// C2-H02-CT01
// RN08 / SC07
// Adicionar produto ao carrinho e atualizar contador
// ============================================================

async function CT01() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    await adicionarProduto(page, 'sauce-labs-backpack');

    const badge = page.locator('.shopping_cart_badge');

    await badge.waitFor();

    const quantidade = await badge.textContent();

    if (quantidade !== '1') {
      throw new Error(`Contador esperado: 1. Obtido: ${quantidade}`);
    }

    console.log('C2-H02-CT01: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT01: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H02-CT02
// RN09 / SC08
// Não adicionar o mesmo produto duas vezes
// ============================================================

async function CT02() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    const botaoAdicionar = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await botaoAdicionar.click();

    // Após adicionar, o botão deve mudar para "Remove"
    const botaoRemover = page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    );

    await botaoRemover.waitFor();

    // O botão de adicionar novamente não deve existir
    if (await botaoAdicionar.isVisible()) {
      throw new Error('O botão de adicionar ainda está visível.');
    }

    // O contador deve continuar sendo 1
    const badge = page.locator('.shopping_cart_badge');
    const quantidade = await badge.textContent();

    if (quantidade !== '1') {
      throw new Error(
        `Quantidade esperada no carrinho: 1. Obtida: ${quantidade}`
      );
    }

    // Confirma que existe apenas um item no carrinho
    await acessarCarrinho(page);

    const itens = page.locator('.cart_item');
    const quantidadeItens = await itens.count();

    if (quantidadeItens !== 1) {
      throw new Error(
        `Quantidade esperada de itens: 1. Obtida: ${quantidadeItens}`
      );
    }

    const quantidadeProduto = page.locator('.cart_quantity');
    const quantidadeNoCarrinho = await quantidadeProduto.textContent();

    if (quantidadeNoCarrinho.trim() !== '1') {
      throw new Error(
        `Quantidade esperada do produto: 1. Obtida: ${quantidadeNoCarrinho}`
      );
    }

    console.log('C2-H02-CT02: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT02: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H02-CT03
// RN10 / SC09
// Exibir identidade, quantidade e preço do produto
// ============================================================

async function CT03() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    await adicionarProduto(page, 'sauce-labs-backpack');

    await acessarCarrinho(page);

    const nome = await page
      .locator('.inventory_item_name')
      .textContent();

    const quantidade = await page
      .locator('.cart_quantity')
      .textContent();

    const preco = await page
      .locator('.inventory_item_price')
      .textContent();

    if (nome.trim() !== 'Sauce Labs Backpack') {
      throw new Error(
        `Produto esperado: Sauce Labs Backpack. Obtido: ${nome}`
      );
    }

    if (quantidade.trim() !== '1') {
      throw new Error(
        `Quantidade esperada: 1. Obtida: ${quantidade}`
      );
    }

    if (preco.trim() !== '$29.99') {
      throw new Error(
        `Preço esperado: $29.99. Obtido: ${preco}`
      );
    }

    console.log('C2-H02-CT03: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT03: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H02-CT04
// RN11 / SC10
// Remover produto e manter os demais produtos
// ============================================================

async function CT04() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    // Adiciona dois produtos
    await adicionarProduto(page, 'sauce-labs-backpack');
    await adicionarProduto(page, 'sauce-labs-bike-light');

    await acessarCarrinho(page);

    const itensAntes = await page.locator('.cart_item').count();

    if (itensAntes !== 2) {
      throw new Error(
        `Esperados 2 produtos antes da remoção. Obtidos: ${itensAntes}`
      );
    }

    // Remove apenas a mochila
    await page
      .locator('[data-test="remove-sauce-labs-backpack"]')
      .click();

    // Deve permanecer apenas a Bike Light
    const itensDepois = page.locator('.cart_item');
    const quantidadeDepois = await itensDepois.count();

    if (quantidadeDepois !== 1) {
      throw new Error(
        `Esperado 1 produto após remoção. Obtidos: ${quantidadeDepois}`
      );
    }

    const produtoRestante = await page
      .locator('.inventory_item_name')
      .textContent();

    if (produtoRestante.trim() !== 'Sauce Labs Bike Light') {
      throw new Error(
        `Produto restante inesperado: ${produtoRestante}`
      );
    }

    const badge = page.locator('.shopping_cart_badge');

    if (await badge.isVisible()) {
      const quantidade = await badge.textContent();

      if (quantidade !== '1') {
        throw new Error(
          `Contador esperado: 1. Obtido: ${quantidade}`
        );
      }
    }

    console.log('C2-H02-CT04: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT04: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H02-CT05
// RN12 / SC11
// Remover todos os produtos e deixar o carrinho vazio
// ============================================================

async function CT05() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    await adicionarProduto(page, 'sauce-labs-backpack');
    await adicionarProduto(page, 'sauce-labs-bike-light');

    await acessarCarrinho(page);

    // Remove mochila
    await page
      .locator('[data-test="remove-sauce-labs-backpack"]')
      .click();

    // Remove Bike Light
    await page
      .locator('[data-test="remove-sauce-labs-bike-light"]')
      .click();

    // O carrinho deve ficar sem itens
    const itens = page.locator('.cart_item');
    const quantidadeItens = await itens.count();

    if (quantidadeItens !== 0) {
      throw new Error(
        `Carrinho deveria estar vazio. Foram encontrados ${quantidadeItens} itens.`
      );
    }

    // O contador deve desaparecer
    const badge = page.locator('.shopping_cart_badge');

    if (await badge.isVisible()) {
      throw new Error('O contador do carrinho ainda está visível.');
    }

    console.log('C2-H02-CT05: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT05: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H02-CT06
// RN13 / SC12
// Continuar comprando e retornar para a página de produtos
// ============================================================

async function CT06() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    await adicionarProduto(page, 'sauce-labs-backpack');

    await acessarCarrinho(page);

    await page
      .locator('[data-test="continue-shopping"]')
      .click();

    await page.waitForURL('**/inventory.html');
    await page.locator('.inventory_list').waitFor();

    const titulo = await page.locator('.title').textContent();

    if (titulo.trim() !== 'Products') {
      throw new Error(
        `Título esperado: Products. Obtido: ${titulo}`
      );
    }

    console.log('C2-H02-CT06: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT06: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// C2-H02-CT07
// RN14 / SC13
// Acessar checkout a partir do carrinho
// ============================================================

async function CT07() {
  const browser = await iniciar();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    await adicionarProduto(page, 'sauce-labs-backpack');

    await acessarCarrinho(page);

    await page
      .locator('[data-test="checkout"]')
      .click();

    await page.waitForURL('**/checkout-step-one.html');

    const titulo = await page.locator('.title').textContent();

    if (titulo.trim() !== 'Checkout: Your Information') {
      throw new Error(
        `Título esperado: Checkout: Your Information. Obtido: ${titulo}`
      );
    }

    console.log('C2-H02-CT07: PASSOU');
  } catch (erro) {
    console.log('C2-H02-CT07: FALHOU');
    console.log(erro.message);
  } finally {
    await browser.close();
  }
}


// ============================================================
// EXECUÇÃO DOS 7 TESTES
// ============================================================

async function executarTestes() {
  await CT01();
  await CT02();
  await CT03();
  await CT04();
  await CT05();
  await CT06();
  await CT07();
}

executarTestes();