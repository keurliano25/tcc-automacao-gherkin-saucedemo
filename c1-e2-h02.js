const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });

  // =========================================================
  // CT01 - Adicionar produto ao carrinho
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    const contador = page.locator('.shopping_cart_badge');
    await expect(contador).toHaveText('1');

    console.log('C1-E2-H02-CT01: PASSOU');

    await page.close();
  }

  // =========================================================
  // CT02 - Não adicionar o mesmo produto duas vezes
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const botaoAdicionar = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await botaoAdicionar.click();

    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    console.log('C1-E2-H02-CT02: PASSOU');

    await page.close();
  }

  // =========================================================
  // CT03 - Visualizar produto no carrinho
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name'))
      .toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.cart_quantity')).toHaveText('1');
    await expect(page.locator('.inventory_item_price'))
      .toHaveText('$29.99');

    console.log('C1-E2-H02-CT03: PASSOU');

    await page.close();
  }

  // =========================================================
  // CT04 - Remover produto do carrinho
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    ).click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    console.log('C1-E2-H02-CT04: PASSOU');

    await page.close();
  }

  // =========================================================
  // CT05 - Remover todos os produtos do carrinho
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    ).click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    console.log('C1-E2-H02-CT05: PASSOU');

    await page.close();
  }

  // =========================================================
  // CT06 - Continuar comprando
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator('[data-test="continue-shopping"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');

    console.log('C1-E2-H02-CT06: PASSOU');

    await page.close();
  }

  // =========================================================
  // CT07 - Acessar checkout
  // =========================================================
  {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('.title'))
      .toHaveText('Checkout: Your Information');

    console.log('C1-E2-H02-CT07: PASSOU');

    await page.close();
  }

  await browser.close();

  console.log('');
  console.log('C1-E2-H02: EXECUÇÃO CONCLUÍDA');
})();