import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

Given('User is on the login page', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('User enters {string} and {string}', async function (username: string, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(username, password);
});

Then('User should be redirected to the dashboard page', async function () {
  console.log(await this.page.url());
  await expect(this.page).toHaveURL(/inventory.html/);
});

Then('User should see an error message', async function () {
  const loginPage = new LoginPage(this.page);
  await expect(await loginPage.errorMessage()).toBeVisible();
});