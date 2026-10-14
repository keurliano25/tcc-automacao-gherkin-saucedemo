const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');

  // Informa um Username válido.
  await page.locator('#user-name').fill('standard_user');

  // Informa uma Password incorreta.
  await page.locator('#password').fill('senha_incorreta');

  // Tenta realizar o login.
  await page.locator('#login-button').click();

  // Localiza a mensagem de erro.
  const mensagem = page.locator('[data-test="error"]');

  // Valida o resultado esperado pelo cenário.
  await expect(mensagem).toContainText(
    'Username and password do not match any user in this service'
  );

  console.log('CT04: PASSOU');

  await browser.close();
})();