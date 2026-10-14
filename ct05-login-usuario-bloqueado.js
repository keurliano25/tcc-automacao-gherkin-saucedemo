const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Informa o usuário bloqueado.
  await page.locator('#user-name').fill('locked_out_user');

  // Informa a senha válida.
  await page.locator('#password').fill('secret_sauce');

  // Tenta realizar o login.
  await page.locator('#login-button').click();

  // Localiza a mensagem de erro.
  const mensagem = page.locator('[data-test="error"]');

  // Valida o resultado esperado pelo cenário.
  await expect(mensagem).toContainText(
    'Sorry, this user has been locked out.'
  );

  console.log('CT05: PASSOU');

  await browser.close();
})();