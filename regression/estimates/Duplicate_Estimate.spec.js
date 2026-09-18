// Duplicate an Approved estimate and assert copied fields on the new Draft
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Duplicate Estimate @regression @set1', async ({ page }) => {
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

  const productClassDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Product Class"]//following-sibling::div//span').first();
  await expect(productClassDiv).toBeVisible();
  const productClassContent = (await productClassDiv.innerText()).trim();
  console.log(`[data] productClassContent: ${productClassContent}`);

  const printMethodDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Print Method"]//following-sibling::div//span').first();
  await expect(printMethodDiv).toBeVisible();
  const printMethodContent = (await printMethodDiv.innerText()).trim();
  console.log(`[data] printMethodContent: ${printMethodContent}`);

  const descriptionDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Description"]//following-sibling::div//span').first();
  await expect(descriptionDiv).toBeVisible();
  const descriptionContent = (await descriptionDiv.innerText()).trim();
  console.log(`[data] descriptionContent: ${descriptionContent}`);

  const billToAddressDiv = page.locator('(//span[normalize-space()="Bill To"]/following::div[normalize-space()="Customer Address"]//following::span[@class="text-right"])[1]');
  const billToAddressDivCount = await billToAddressDiv.count();
  console.log(`[data] billToAddressDivCount: ${billToAddressDivCount}`);
  let billToAddressContent = '';
  if (billToAddressDivCount === 0) {
    const addressNothingSelected = page.locator('(//span[normalize-space()="Bill To"]/following::div[normalize-space()="Customer Address"]/following-sibling::div//*[normalize-space(.)="Nothing Selected"])[3]');
    await expect(addressNothingSelected).toBeVisible();
    billToAddressContent = (await addressNothingSelected.innerText()).trim();
  } else {
    billToAddressContent = (await billToAddressDiv.textContent()).trim();
  }
  console.log(`[data] billToAddressContent: ${billToAddressContent}`);

  const duplicateEstimateButton = page.locator('button[x-tooltip="Duplicate Estimate"]');
  await expect(duplicateEstimateButton).toBeEnabled();
  await duplicateEstimateButton.click();

  const duplicateEstimateHeading = page.locator('#modal-headline');
  await expect(duplicateEstimateHeading).toBeVisible();
  await expect(duplicateEstimateHeading).toHaveText('Duplicate Estimate');

  const confirmButton = page.locator('[data-cy="confirm"]');
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  await page.waitForLoadState('domcontentloaded');

  const statusDraftDivAfterDuplicate = page.locator('div').filter({ hasText: 'Status Draft' }).first();
  await expect(statusDraftDivAfterDuplicate).toBeVisible();

  const estimateTextAfterDuplicate = await page.locator('//div[@class="section"]//h1//span').innerText();
  const estimateNumberAfterDuplicate = estimateTextAfterDuplicate.replace(/\s*-\s*Estimate\s*$/, '').trim();
  console.log(`[data] estimateNumberAfterDuplicate: ${estimateNumberAfterDuplicate}`);
  await expect(estimateNumberAfterDuplicate).not.toBe(estimateNumber);

  const draftIcon = page.locator(
    '//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]'
  );
  await expect(draftIcon).toBeVisible();
  await expect(draftIcon).toHaveCount(1);

  const productClassDivAfterDuplicate = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Product Class"]//following-sibling::div//span').first();
  await expect(productClassDivAfterDuplicate).toBeVisible();
  const productClassContentAfterDuplicate = (await productClassDivAfterDuplicate.innerText()).trim();
  await expect(productClassContentAfterDuplicate).toBe(productClassContent);

  const printMethodDivAfterDuplicate = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Print Method"]//following-sibling::div//span').first();
  await expect(printMethodDivAfterDuplicate).toBeVisible();
  const printMethodContentAfterDuplicate = (await printMethodDivAfterDuplicate.innerText()).trim();
  await expect(printMethodContentAfterDuplicate).toBe(printMethodContent);

  const billToAddressDivAfterDuplicate = page.locator('(//span[normalize-space()="Bill To"]/following::div[normalize-space()="Customer Address"]//following::span[@class="text-right"])[1]');
  const billToAddressDivCountAfterDuplicate = await billToAddressDivAfterDuplicate.count();
  let billToAddressContentAfterDuplicate = '';
  if (billToAddressDivCountAfterDuplicate === 0) {
    const addressNothingSelectedAfterDuplicate = page.locator('(//span[normalize-space()="Bill To"]/following::div[normalize-space()="Customer Address"]/following-sibling::div//*[normalize-space(.)="Nothing Selected"])[3]');
    await expect(addressNothingSelectedAfterDuplicate).toBeVisible();
    billToAddressContentAfterDuplicate = (await addressNothingSelectedAfterDuplicate.innerText()).trim();
  } else {
    billToAddressContentAfterDuplicate = (await billToAddressDivAfterDuplicate.textContent()).trim();
  }
  await expect(billToAddressContentAfterDuplicate).toBe(billToAddressContent);

  const descriptionDivAfterDuplicate = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Description"]//following-sibling::div//span').first();
  await expect(descriptionDivAfterDuplicate).toBeVisible();
  const descriptionContentAfterDuplicate = (await descriptionDivAfterDuplicate.innerText()).trim();
  await expect(descriptionContentAfterDuplicate).toBe(descriptionContent);

  const advanceToApprovedButtonAfterDuplicate = page.locator('//p[normalize-space()="Advance to APPROVED"]');
  await expect(advanceToApprovedButtonAfterDuplicate).toBeVisible();

  const pushbackButtonAfterDuplicate = page.locator('//p[normalize-space()="Push Back"]');
  await expect(pushbackButtonAfterDuplicate).toBeVisible();
});
