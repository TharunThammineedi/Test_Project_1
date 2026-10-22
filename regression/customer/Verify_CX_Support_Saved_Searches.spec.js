// Verify CX Support Dashboard Save Search / Reset toolbar links and Saved Searches list
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify CX Support Saved Searches @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  const savedSearchName = `CX Support ${session.brandName}`.trim().slice(0, 40);
  console.log(`[data] savedSearchName: ${savedSearchName}`);

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
  await page.waitForLoadState('domcontentloaded');

  const customerSidebarButton = page.locator('(//button[normalize-space()="Customer"])[1]');
  await expect(customerSidebarButton).toBeVisible();
  await customerSidebarButton.click();

  const cxSupportDashboardLink = page.getByRole('link', { name: 'CX Support Dashboard', exact: true });
  await expect(cxSupportDashboardLink).toBeVisible();
  await expect(cxSupportDashboardLink).toBeEnabled();
  await cxSupportDashboardLink.click();
  await page.waitForLoadState('domcontentloaded');

  const dashboardHeading = page.locator('label').filter({ hasText: 'CX Support Dashboard' }).first();
  await expect(dashboardHeading).toBeVisible();

  const toolbarSaveSearchButton = page.locator('button[x-on\\:click*="toggleSave"]').first();
  const toolbarResetButton = page.locator('button[wire\\:click="resetAll"]').first();
  const savedSearchesButton = page.locator('button[x-tooltip="Saved Searches"]');
  await expect(savedSearchesButton).toBeVisible();

  const defaultFiltersButton = page.getByRole('button', { name: 'Filters', exact: false });
  await expect(defaultFiltersButton).toBeVisible();
  await expect(toolbarSaveSearchButton).toBeVisible();
  await expect(toolbarResetButton).toBeVisible();
  await expect(defaultFiltersButton).toBeEnabled();
  await defaultFiltersButton.click();

  const resetFiltersButton = page.locator('button[wire\\:click="resetRows"]').first();
  await expect(resetFiltersButton).toBeVisible();
  await expect(resetFiltersButton).toBeEnabled();
  await resetFiltersButton.click();
  await page.waitForTimeout(2000);

  const filtersButtonAfterReset = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButtonAfterReset).toBeVisible();
  await expect(toolbarSaveSearchButton).toBeHidden();
  await expect(toolbarResetButton).toBeHidden();
  await expect(filtersButtonAfterReset).toBeEnabled();
  await filtersButtonAfterReset.click();
  await page.waitForTimeout(1000);

  const filterColumnInput = page.locator('input[name="rows.0.column"][type="text"]').first();
  await expect(filterColumnInput).toBeVisible();
  await expect(filterColumnInput).toBeEnabled();
  await filterColumnInput.click();
  const opportunityManagerOption = page.locator('li[data-label="Opportunity Manager"]').first();
  await expect(opportunityManagerOption).toBeVisible();
  await opportunityManagerOption.click();

  const filterOperatorInput = page.locator('input[name="rows.0.operator"][type="text"]').first();
  await expect(filterOperatorInput).toBeVisible();
  await expect(filterOperatorInput).toBeEnabled();
  await filterOperatorInput.click();
  const isOption = page.locator('li[data-label="is"]').first();
  await expect(isOption).toBeVisible();
  await isOption.click();

  const filterValueInput = page.locator('input[name="rows.0.value"][type="text"]').first();
  await expect(filterValueInput).toBeVisible();
  await expect(filterValueInput).toBeEnabled();
  await filterValueInput.click();
  const opportunityManagerValueOption = page.locator(`li[data-label="${testData.userPicker}"]`).first();
  await expect(opportunityManagerValueOption).toBeVisible();
  await opportunityManagerValueOption.click();

  const applyFilterButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
  await expect(applyFilterButton).toBeEnabled();
  await applyFilterButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

  const sort0Button = page.getByRole('button', { name: 'Sort 0', exact: true });
  await expect(sort0Button).toBeEnabled();
  await sort0Button.click();

  const directionInput = page.locator('input[name="rows.0.direction"][type="text"]');
  await expect(directionInput).toBeVisible();
  await expect(directionInput).toBeEnabled();
  await directionInput.click();
  const descendingOption = page.locator('li[data-label="desc"]');
  await expect(descendingOption).toBeVisible();
  await descendingOption.click();

  const applySortButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
  await expect(applySortButton).toBeEnabled();
  await applySortButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Sort 1', exact: true })).toBeVisible();
  await expect(toolbarSaveSearchButton).toBeVisible();
  await expect(toolbarResetButton).toBeVisible();

  await expect(toolbarSaveSearchButton).toBeEnabled();
  await toolbarSaveSearchButton.click();
  await page.waitForTimeout(1000);

  const savedSearchNameInput = page.locator('input[name="name"][type="text"]');
  await expect(savedSearchNameInput).toBeVisible();
  await expect(savedSearchNameInput).toBeEditable();
  await savedSearchNameInput.fill(`${savedSearchName} cancel`);

  const cancelSaveSearchButton = page.locator("//input[@name='name']/ancestor::div[.//button][1]//button[normalize-space()='Cancel']").first();
  await expect(cancelSaveSearchButton).toBeVisible();
  await expect(cancelSaveSearchButton).toBeEnabled();
  await cancelSaveSearchButton.click();
  await page.waitForTimeout(1000);

  await expect(savedSearchNameInput).toBeHidden();

  await expect(savedSearchesButton).toBeEnabled();
  await savedSearchesButton.click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: `${savedSearchName} cancel`, exact: true })).toHaveCount(0);

  const closeSavedSearchesButton = page.getByRole('button', { name: 'Cancel', exact: true }).first();
  await expect(closeSavedSearchesButton).toBeEnabled();
  await closeSavedSearchesButton.click();
  await page.waitForTimeout(1000);

  await expect(toolbarSaveSearchButton).toBeEnabled();
  await toolbarSaveSearchButton.click();
  await page.waitForTimeout(1000);
  await expect(savedSearchNameInput).toBeVisible();
  await expect(savedSearchNameInput).toBeEditable();
  await savedSearchNameInput.fill(savedSearchName);

  const dialogSaveSearchButton = page.locator('button[wire\\:click="save"]').first();
  await expect(dialogSaveSearchButton).toBeEnabled();
  await dialogSaveSearchButton.click();
  await page.waitForTimeout(2000);

  await expect(toolbarSaveSearchButton).toBeEnabled();
  await toolbarSaveSearchButton.click();
  await page.waitForTimeout(1000);
  await expect(savedSearchNameInput).toBeVisible();
  await expect(savedSearchNameInput).toBeEditable();
  await savedSearchNameInput.fill(savedSearchName);
  await expect(dialogSaveSearchButton).toBeEnabled();
  await dialogSaveSearchButton.click();
  await page.waitForTimeout(2000);

  await expect(savedSearchesButton).toBeEnabled();
  await savedSearchesButton.click();
  await page.waitForTimeout(1000);

  const duplicateSavedSearchButtons = page.getByRole('button', { name: savedSearchName, exact: true });
  await expect(duplicateSavedSearchButtons).toHaveCount(2);
  console.log(`[data] duplicateSavedSearchCount: 2`);

  await expect(duplicateSavedSearchButtons.first()).toBeEnabled();
  await duplicateSavedSearchButtons.first().click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();
  await expect(toolbarSaveSearchButton).toBeVisible();
  await expect(toolbarResetButton).toBeVisible();

  const opportunityManagerRows = page.locator('tbody tr').filter({ hasText: 'Opportunity Manager:' });
  const opportunityManagerCount = await opportunityManagerRows.count();
  expect(opportunityManagerCount).toBeGreaterThan(0);
  for (let i = 0; i < opportunityManagerCount; i++) {
    const rowText = ((await opportunityManagerRows.nth(i).innerText()) || '').toLowerCase();
    expect(rowText).toContain(testData.userPicker.toLowerCase());
  }
  console.log(`[data] appliedSavedSearchRows: ${opportunityManagerCount}`);

  await expect(toolbarResetButton).toBeEnabled();
  await toolbarResetButton.click();
  await page.waitForTimeout(2000);

  await expect(toolbarSaveSearchButton).toBeHidden();
  await expect(toolbarResetButton).toBeHidden();
  await expect(page.getByRole('button', { name: 'Filters 0', exact: true })).toBeVisible();

  await expect(savedSearchesButton).toBeEnabled();
  await savedSearchesButton.click();
  await page.waitForTimeout(1000);

  const deleteSavedSearchButton = page.locator(`//button[normalize-space()="${savedSearchName}"]/following::button[@x-tooltip="Delete"][1]`).first();
  await expect(deleteSavedSearchButton).toBeEnabled();
  await deleteSavedSearchButton.click();
  await page.waitForTimeout(1500);
  await expect(deleteSavedSearchButton).toBeEnabled();
  await deleteSavedSearchButton.click();
  await page.waitForTimeout(1500);
  await expect(page.getByRole('button', { name: savedSearchName, exact: true })).toHaveCount(0);
});
