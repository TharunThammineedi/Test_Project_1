// Link product routes on an Approved estimate, search, then unlink one
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Link Estimate Product Routes @regression @set1', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  await page.goto(testData.url);
  await page.waitForLoadState('domcontentloaded');

  const signInWithEmailButton = page.locator('[data-cy="btnLoginVisible"]');
  await expect(signInWithEmailButton).toBeEnabled();
  await signInWithEmailButton.click();

  const emailInput = page.locator('input[name="email"][type="email"]');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEditable();
  await emailInput.fill(testData.email);

  const passwordInput = page.locator('input[name="password"][type="password"]');
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toBeEditable();
  await passwordInput.fill(testData.password);

  const signInConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(signInConfirmButton).toBeEnabled();
  await signInConfirmButton.click();

  const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
  await expect(estimateMenuLink).toBeVisible();
  await estimateMenuLink.click();

  const estimatesQuotesLink = page.getByRole('link', {
    name: 'Estimates/Quotes',
    exact: true
  });
  await expect(estimatesQuotesLink).toBeVisible();
  await expect(estimatesQuotesLink).toBeEnabled();
  await estimatesQuotesLink.click();

  await page.waitForLoadState('domcontentloaded');

  const newEstimateLink = page.getByRole('link', { name: 'New Estimate', exact: true });
  await expect(newEstimateLink).toBeVisible();

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeEnabled();
  await filtersButton.click();

  const columnSelect = page.locator('select[data-flux-select-native][x-model="selection.column"]').first();
  await columnSelect.selectOption('status');

  const operatorSelect = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect.selectOption('is equal to');

  const valueSelect = page.locator("xpath=//option[normalize-space(.)='Value']/ancestor::select");
  await valueSelect.selectOption('Approved');

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();
  await page.waitForTimeout(3000);

  const column10 = page.locator('//thead/tr/th[10]//following::tbody/tr/td[10]/div//span');
  const column10Text = await column10.allTextContents();
  for (const text of column10Text) {
    expect(text.trim()).toBe('Approved');
  }

  const firstEstimateLink = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstEstimateLink).toBeVisible();
  await expect(firstEstimateLink).toBeEnabled();
  await firstEstimateLink.click();
  await page.waitForTimeout(2000);

  const estimateText = await page.locator('//div[@class="section"]//h1//span').innerText();
  const estimateNumber = estimateText.replace(/\s*-\s*Estimate\s*$/, '').trim();
  console.log(`[data] estimateNumber: ${estimateNumber}`);

  const statusApprovedDiv = page.locator('div').filter({ hasText: 'Approved' }).first();
  await expect(statusApprovedDiv).toBeVisible();

  const linksTabButton = page.locator('[data-cy="hub-tab-links"]');
  await expect(linksTabButton).toBeVisible();
  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();

  const productRoutesHeading = page.locator('h3').filter({ hasText: 'Product Routes' }).first();
  await expect(productRoutesHeading).toBeVisible();
  await page.waitForTimeout(2000);

  const linkRoutesButton = page.getByRole('button', { name: 'Link Routes', exact: true });
  await expect(linkRoutesButton).toBeEnabled();
  await linkRoutesButton.click();

  const chooseProductRoutesHeading = page.locator('h3').filter({ hasText: 'Choose Product Routes' }).first();
  await expect(chooseProductRoutesHeading).toBeVisible();

  const checkbox1 = page.locator('input[name="selectedIds"]').nth(0);
  await expect(checkbox1).toBeVisible();
  await checkbox1.check();
  await expect(checkbox1).toBeChecked();
  const expectedText1 = (await checkbox1.locator('xpath=following-sibling::label').innerText()).trim();
  console.log(`[data] checkbox1Text: ${expectedText1}`);

  const checkbox2 = page.locator('input[name="selectedIds"]').nth(1);
  await expect(checkbox2).toBeVisible();
  await checkbox2.check();
  await expect(checkbox2).toBeChecked();
  const expectedText2 = (await checkbox2.locator('xpath=following-sibling::label').innerText()).trim();
  console.log(`[data] checkbox2Text: ${expectedText2}`);

  const productRoutesQuickSearchInput = page.locator('//h3[normalize-space()="Choose Product Routes"]//following::input[@placeholder="Quick Search"]');
  await expect(productRoutesQuickSearchInput).toBeVisible();
  await expect(productRoutesQuickSearchInput).toBeEditable();
  await productRoutesQuickSearchInput.fill(expectedText2);
  await page.waitForTimeout(2000);
  await expect(page.locator(`(//label[normalize-space()="${expectedText2}"])[2]`)).toBeVisible();
  await expect(page.locator(`(//label[normalize-space()="${expectedText1}"])[2]`)).not.toBeVisible();
  await productRoutesQuickSearchInput.clear();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page.locator('p').filter({ hasText: 'Routes linked.' }).first()).toBeVisible();
  await expect(page.locator('td').filter({ hasText: expectedText1 }).first()).toBeVisible();
  await expect(page.locator('td').filter({ hasText: expectedText2 }).first()).toBeVisible();

  const productRouteRows = page.locator('//h3[normalize-space()="Product Routes"]//following::table//thead/following-sibling::tbody/tr');
  const rowCountBefore = await productRouteRows.count();
  console.log(`[data] rowCountBefore: ${rowCountBefore}`);

  const quickSearchInput = page.locator('[data-cy="input"]').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();
  await quickSearchInput.fill(expectedText1);
  await expect(page.locator('td').filter({ hasText: expectedText1 }).first()).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(productRouteRows).toHaveCount(1);

  await quickSearchInput.clear();
  await page.waitForTimeout(2000);
  await expect(productRouteRows).toHaveCount(rowCountBefore);

  const unlinkRoutesButton = page.locator(`//div[normalize-space()="${expectedText1}"]//following::td[7]//button`);
  await expect(unlinkRoutesButton).toBeVisible();
  await expect(unlinkRoutesButton).toBeEnabled();
  page.once('dialog', async (dialog) => {
    console.log(`[data] unlink dialog: ${dialog.message()}`);
    await dialog.accept();
  });
  await unlinkRoutesButton.click();
  await page.waitForTimeout(2000);

  const unlinkRoutesButtonAfterUnlink = page.locator(`//div[normalize-space()="${expectedText1}"]//following::td[7]//button`);
  await expect(unlinkRoutesButtonAfterUnlink).not.toBeVisible();

});
