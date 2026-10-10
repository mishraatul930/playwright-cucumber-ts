import { expect, Page } from '@playwright/test';

export class InventoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async addToCart(item: string) {
        const itemLocator = this.page.locator('.inventory_item').filter({ hasText: item });
        await itemLocator.getByRole('button', { name: 'Add to cart' }).click();
        await expect(itemLocator.getByRole('button', { name: 'Remove' })).toBeVisible();
    }

    async getCartItems(): Promise<string[]> {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
        await this.page.getByText('Your Cart', { exact: true }).waitFor({ state: 'visible' });
        const cartItems = await this.page.locator('.cart_item .inventory_item_name').allTextContents();
        console.log('Cart Items:', cartItems);
        return cartItems;
    }
}