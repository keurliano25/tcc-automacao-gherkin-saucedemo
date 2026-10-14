const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });

  // ============================================================
  // CT01 - Impedir avanço sem informar o First Name
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      // First Name vazio
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();

      const mensagem = page.locator('[data-test="error"]');

      await expect(mensagem).toContainText(
        'First Name is required'
      );

      console.log('C1-E2-H03-CT01: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT01: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT02 - Impedir avanço sem informar o Last Name
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      // Last Name vazio
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();

      const mensagem = page.locator('[data-test="error"]');

      await expect(mensagem).toContainText(
        'Last Name is required'
      );

      console.log('C1-E2-H03-CT02: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT02: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT03 - Impedir avanço sem informar o Postal Code
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      // Postal Code vazio

      await page.locator('[data-test="continue"]').click();

      const mensagem = page.locator('[data-test="error"]');

      await expect(mensagem).toContainText(
        'Postal Code is required'
      );

      console.log('C1-E2-H03-CT03: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT03: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT04 - Avançar para o Checkout Overview
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();

      await expect(page).toHaveURL(
        /checkout-step-two\.html/
      );

      await expect(page.locator('.title')).toHaveText(
        'Checkout: Overview'
      );

      console.log('C1-E2-H03-CT04: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT04: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT05 - Cancelar o preenchimento das informações do checkout
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="cancel"]').click();

      // Conforme o cenário original, espera-se retornar à página de produtos.
      await expect(page).toHaveURL(
        /inventory\.html/
      );

      await expect(page.locator('.title')).toHaveText(
        'Products'
      );

      console.log('C1-E2-H03-CT05: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT05: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT06 - Apresentar o Checkout Overview antes da finalização
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();

      await expect(page).toHaveURL(
        /checkout-step-two\.html/
      );

      await expect(page.locator('.title')).toHaveText(
        'Checkout: Overview'
      );

      // Confirma que a compra ainda não foi finalizada.
      await expect(page).not.toHaveURL(
        /checkout-complete\.html/
      );

      console.log('C1-E2-H03-CT06: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT06: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT07 - Finalizar a compra
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();

      await expect(page).toHaveURL(
        /checkout-step-two\.html/
      );

      await page.locator('[data-test="finish"]').click();

      await expect(page).toHaveURL(
        /checkout-complete\.html/
      );

      await expect(page.locator('.title')).toHaveText(
        'Checkout: Complete!'
      );

      console.log('C1-E2-H03-CT07: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT07: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT08 - Apresentar a confirmação de conclusão da compra
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();
      await page.locator('[data-test="finish"]').click();

      await expect(page).toHaveURL(
        /checkout-complete\.html/
      );

      await expect(page.locator('.complete-header')).toContainText(
        'Thank you for your order'
      );

      console.log('C1-E2-H03-CT08: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT08: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  // ============================================================
  // CT09 - Retornar à página de produtos após concluir a compra
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();
      await page.locator('[data-test="finish"]').click();

      await expect(page).toHaveURL(
        /checkout-complete\.html/
      );

      await page.locator('[data-test="back-to-products"]').click();

      await expect(page).toHaveURL(
        /inventory\.html/
      );

      await expect(page.locator('.title')).toHaveText(
        'Products'
      );

      console.log('C1-E2-H03-CT09: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT09: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }//

  // ============================================================
  // CT10 - Gerar e baixar o PDF do pedido
  // ============================================================
  {
    const page = await browser.newPage();

    try {
      await page.goto('https://www.saucedemo.com/');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('.shopping_cart_link').click();

      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Keurliano');
      await page.locator('[data-test="lastName"]').fill('Silva');
      await page.locator('[data-test="postalCode"]').fill('88000-000');

      await page.locator('[data-test="continue"]').click();
      await page.locator('[data-test="finish"]').click();

      await expect(page).toHaveURL(
        /checkout-complete\.html/
      );

      const downloadPromise = page.waitForEvent('download');

      // Procura o recurso de geração/download do pedido.
      const elementosPDF = page.getByText(/PDF|Download|Order/i);

      if (await elementosPDF.count() === 0) {
        throw new Error(
          'Nenhum recurso relacionado à geração ou download do PDF foi encontrado na página.'
        );
      }

      console.log('Recurso relacionado ao PDF encontrado.');

      const primeiroElemento = elementosPDF.first();

      await primeiroElemento.click();

      const download = await downloadPromise;

      const caminho = await download.path();

      if (!caminho) {
        throw new Error(
          'O arquivo PDF não foi disponibilizado para download.'
        );
      }

      console.log('Arquivo PDF baixado com sucesso.');
      console.log(`Arquivo: ${download.suggestedFilename()}`);

      console.log('C1-E2-H03-CT10: PASSOU');
    } catch (erro) {
      console.log('C1-E2-H03-CT10: FALHOU');
      console.log(erro.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
})();