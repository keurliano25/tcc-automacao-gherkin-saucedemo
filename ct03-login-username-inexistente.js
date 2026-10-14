const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Informa um Username que não existe.
  await page.locator('#user-name').fill('usuario_inexistente');

  // Informa uma Password válida.
  await page.locator('#password').fill('secret_sauce');

  // Tenta realizar o login.
  await page.locator('#login-button').click();

  // Localiza a mensagem de erro.
  const mensagem = page.locator('[data-test="error"]');

  // Valida o resultado esperado pelo cenário.
  await expect(mensagem).toContainText(
    'Username and password do not match any user in this service'
  );

  console.log('CT03: PASSOU');

  await browser.close();
})();