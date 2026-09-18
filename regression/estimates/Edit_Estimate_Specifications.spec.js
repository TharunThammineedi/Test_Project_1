// Edit Specification sections on an existing Draft Estimate
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Edit Estimate Specifications @regression @set1', async ({ page }) => {
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
  await valueSelect.selectOption('draft');

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

  const firstEstimateCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstEstimateCell).toBeVisible();
  await expect(firstEstimateCell).toContainText(/EST\d+/);
  const cellText = (await firstEstimateCell.textContent()) || '';
  const estimateNumber = cellText.match(/EST\d+/)[0];
  console.log(`[data] estimateNumber: ${estimateNumber}`);
  await firstEstimateCell.click();
  await page.waitForTimeout(2000);

  const estimateTitleSpan = page.locator('span').filter({ hasText: `${estimateNumber} - Estimate` }).first();
  await expect(estimateTitleSpan).toBeVisible();

  const specificationsTab = page.locator('//button[normalize-space()="Specifications"]');
  await expect(specificationsTab).toBeVisible();
  await expect(specificationsTab).toBeEnabled();
  await specificationsTab.click();

  const expandAllButton = page.getByRole('button', { name: 'Expand All', exact: true });
  if (await expandAllButton.isVisible()) {
    await expandAllButton.click();
  }

  const editButton = page.locator('//button[@data-cy="edit-button"]');
  await expect(editButton).toBeVisible();
  await expect(editButton).toBeEnabled();
  await editButton.click();

  const editPage = page.locator('//label[contains(normalize-space(), "Edit Estimate")]');
  await expect(editPage).toBeVisible();
  const estimateId = estimateNumber.replace(/^EST0*/, '');
  await expect(editPage).toContainText(estimateId);

  await expect(expandAllButton).toBeVisible();
  await expandAllButton.click();

  const appearanceColorInput = page.locator('input[name="deliverableItemSpecification.substrateColor"][type="text"]');
  await expect(appearanceColorInput).toBeVisible();
  await expect(appearanceColorInput).toBeEditable();
  await appearanceColorInput.fill(testData.appearanceColorRequired);

  const descriptionTextarea = page.locator('textarea[name="deliverableItemDTO.description"]');
  await expect(descriptionTextarea).toBeVisible();
  await expect(descriptionTextarea).toBeEditable();
  await descriptionTextarea.fill(testData.descriptionRequired);
  await expect(descriptionTextarea).toHaveValue(testData.descriptionRequired);

  const saveButton = page.locator('//span[normalize-space()="Save Estimate"]');
  await expect(saveButton).toBeVisible();
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const successMessage = page.getByText('Estimate updated successfully.', { exact: true });
  await expect(successMessage).toBeVisible();

  await expect(specificationsTab).toBeVisible();
  await expect(specificationsTab).toBeEnabled();
  await specificationsTab.click();
  await page.waitForTimeout(2000);

  await expect(expandAllButton).toBeVisible();
  await expect(expandAllButton).toBeEnabled();
  await expandAllButton.click();

  await expect(page.getByText(testData.descriptionRequired, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(testData.appearanceColorRequired, { exact: true }).first()).toBeVisible();
});
