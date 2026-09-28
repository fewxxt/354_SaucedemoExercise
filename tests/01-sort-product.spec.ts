import { test, expect } from '@playwright/test';

test('ST-05: เรียงลำดับสินค้าจากราคาต่ำไปสูง (Price Low to High)', async ({ page }) => {
  // 1. Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // 2. Check Inventory
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 3. Select Price Low to High
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  // 4. Verify prices are ascending
  const priceElements = await page.locator('.inventory_item_price').allInnerTexts();
  const prices = priceElements.map(price => parseFloat(price.replace('$', '')));
  const sortedPrices = [...prices].sort((a, b) => a - b);

  expect(prices).toEqual(sortedPrices);
});