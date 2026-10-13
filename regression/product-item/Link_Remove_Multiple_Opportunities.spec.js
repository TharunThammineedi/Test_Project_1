// Link and Remove a single Opportunity on Product Item
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Link Remove Multiple Opportunities @regression @set2', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  // 1. Go to login page
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

  const loginConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(loginConfirmButton).toBeEnabled();
  await loginConfirmButton.click();

  await page.waitForLoadState('domcontentloaded');

  const itemsMenuButton = page.locator('button').filter({ hasText: 'Items' }).first();
  await expect(itemsMenuButton).toBeEnabled();
  await itemsMenuButton.click();

  const productItemsLink = page.getByRole('link', { name: 'Product Items', exact: true });
  await expect(productItemsLink).toBeVisible();
  await expect(productItemsLink).toBeEnabled();
  await productItemsLink.click();

  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('main').getByText('Product Items')).toBeVisible();

  await page.waitForTimeout(2000);
  const firstProductItem = page.locator('//tbody//tr[1]//td[2]//p[1]');
  await expect(firstProductItem).toBeVisible();
  const firstProductItemText = (await firstProductItem.textContent() || '').split(/\s*\|\s*/)[0].trim().replace(/\|/g, '').trim();
  console.log(`[data] productItemId: ${firstProductItemText}`);

  const productItems_list = page.locator('p').filter({ hasText: firstProductItemText }).first();
  await expect(productItems_list).toBeVisible();
  await firstProductItem.click();

  await page.waitForTimeout(2000);
  const productItemDetailHeading = page.locator('div').filter({ hasText: `${firstProductItemText}-Product Item` }).first();
  await expect(productItemDetailHeading).toBeVisible();
  await expect(productItemDetailHeading).toBeEnabled();

  const linksTabButton = page.locator('[data-cy="hub-tab-links"]');
  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();

  const chooseOpportunitiesButton = page.locator('//button[normalize-space()="Choose Opportunities"]').first();
  const continueButton = page.locator('//h3[normalize-space()="Choose Opportunity"]//..//..//..//..//button[normalize-space()="Continue"]');

  // --- Link single opportunity (row 1) ---
  await expect(chooseOpportunitiesButton).toBeEnabled();
  await chooseOpportunitiesButton.click();
  await page.waitForTimeout(2000);

  const firstOpportunityNameCell = page.locator('(//tbody//tr[1]//td[3]//div)[2]').first();
  await expect(firstOpportunityNameCell).toBeVisible();
  const opportunityName1 = (await firstOpportunityNameCell.textContent() || '').trim();
  console.log(`[data] opportunityName1: ${opportunityName1}`);
  await firstOpportunityNameCell.click();

  const firstOppCodeCell = page.locator('(//tbody//tr[1]//td[2]//div)[2]').first();
  await expect(firstOppCodeCell).toBeVisible();
  const opportunityId1 = (await firstOppCodeCell.textContent() || '').trim();
  console.log(`[data] opportunityId1: ${opportunityId1}`);
  await page.waitForTimeout(2000);

  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  const codeDateDescriptionHeading = page.locator('div').filter({ hasText: 'CODE DATE DESCRIPTION' }).first();
  await expect(codeDateDescriptionHeading).toBeVisible();

  const opportunityAdded1 = page.locator('//span[@x-tooltip="' + opportunityId1 + '"]').first();
  await expect(opportunityAdded1).toBeVisible();
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await expect(opportunityAdded1).toBeVisible();

  // --- Remove the linked opportunity ---
  await opportunityAdded1.click();
  const removeLink = page.locator('//div[normalize-space()="' + opportunityId1 + '"]//following-sibling::div//button[@x-tooltip="Remove"]').first();
  await expect(removeLink).toBeVisible();
  await expect(removeLink).toBeEnabled();
  await removeLink.click();

  const removedialog = page.locator('//h3[text()="Remove Opportunity"]').first();
  await expect(removedialog).toBeVisible();
  const confirmButton = page.locator('//button[normalize-space()="Confirm"]').first();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
  await page.waitForTimeout(2000);

  await expect(page.locator('//span[@x-tooltip="' + opportunityId1 + '"]')).toHaveCount(0);
});
