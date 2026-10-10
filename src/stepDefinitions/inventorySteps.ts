import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

Then('User adds {string} to the cart', async function (item: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.addToCart(item);
});

Then('User should see {string} in the cart', async function (item: string) {
  const inventoryPage = new InventoryPage(this.page);
  const cartItems = await inventoryPage.getCartItems();
  console.log('Expected Item:', item);
  console.log('Actual Cart Items:', cartItems);
  expect(cartItems).toContain(item);
});