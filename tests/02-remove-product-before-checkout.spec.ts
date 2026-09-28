import { test, expect } from '@playwright/test';

test('ST-06: Remove Product ก่อน Checkout แล้วตรวจสอบว่าใน Overview เหลือ 1 ชิ้น', async ({ page }) => {
  // =====================================================
  // 1. Login
  // =====================================================
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // =====================================================
  // 2. Add 2 Products
  // =====================================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // =====================================================
  // 3. Open Cart
  // =====================================================
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(2);

  // =====================================================
  // 4. Remove 1 Product
  // =====================================================
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // =====================================================
  // 5. Checkout & Fill Customer Information
  // =====================================================
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  await page.locator('#postal-code').fill('10110');
  await page.locator('[data-test="continue"]').click();

  // =====================================================
  // 6. Verify Overview (ต้องเหลือเพียง 1 Product)
  // =====================================================
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});