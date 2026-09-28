import { test, expect } from '@playwright/test';

test('ST-07: ตรวจสอบ Validation เมื่อไม่ได้กรอก Postal Code', async ({ page }) => {
  // =====================================================
  // 1. Login
  // =====================================================
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // =====================================================
  // 2. Add Product
  // =====================================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // =====================================================
  // 3. Checkout
  // =====================================================
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // =====================================================
  // 4. กรอก First Name + Last Name แต่ไม่กรอก Postal Code
  // =====================================================
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  // เว้น #postal-code ไว้ ไม่ต้องกรอก
  await page.locator('[data-test="continue"]').click();

  // =====================================================
  // 5. Expected: Postal Code is required
  // =====================================================
  await expect(page.locator('[data-test="error"]'))
    .toContainText(/Postal Code is required/i);
  
  // ต้องยังคงอยู่ในหน้า Checkout Step One
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});