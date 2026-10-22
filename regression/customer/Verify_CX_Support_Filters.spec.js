// Verify CX Support Dashboard filter popup, columns, single/multi filters, Apply and Reset
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify CX Support Filters @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);

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

  const defaultFiltersButton = page.getByRole('button', { name: 'Filters', exact: false });
  await expect(defaultFiltersButton).toBeVisible();
  await expect(defaultFiltersButton).toBeEnabled();
  await defaultFiltersButton.click();

  const resetFiltersButton = page.locator('button[wire\\:click="resetRows"]').first();
  await expect(resetFiltersButton).toBeVisible();
  await expect(resetFiltersButton).toBeEnabled();
  await resetFiltersButton.click();
  await page.waitForTimeout(2000);

  const filtersButtonAfterReset = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButtonAfterReset).toBeVisible();
  await expect(filtersButtonAfterReset).toBeEnabled();
  await filtersButtonAfterReset.click();
  await page.waitForTimeout(1000);

  const whereLabel = page.locator('label').filter({ hasText: 'Where' }).first();
  await expect(whereLabel).toBeVisible();

  const filterColumnInput = page.locator('input[name="rows.0.column"][type="text"]').first();
  await expect(filterColumnInput).toBeVisible();
  await expect(filterColumnInput).toBeEnabled();

  const filterOperatorInput = page.locator('input[name="rows.0.operator"][type="text"]').first();
  await expect(filterOperatorInput).toBeVisible();
  await expect(filterOperatorInput).toBeEnabled();

  const filterValueInput = page.locator('input[name="rows.0.value"][type="text"]').first();
  await expect(filterValueInput).toBeVisible();
  await expect(filterValueInput).toBeEnabled();

  const applyFilterButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
  await expect(applyFilterButton).toBeVisible();

  const addAFilterButton = page.locator('p').filter({ hasText: 'Add A Filter' }).first();
  await expect(addAFilterButton).toBeVisible();

  await expect(resetFiltersButton).toBeVisible();

  await filterColumnInput.click();
  await page.waitForTimeout(1000);
  await expect(page.locator('li[data-label="CX Support"]').first()).toBeVisible();
  await expect(page.locator('li[data-label="Opportunity Manager"]').first()).toBeVisible();
  await expect(page.locator('li[data-label="Opportunity Name"]').first()).toBeVisible();
  await expect(page.locator('li[data-label="Plant"]').first()).toBeVisible();

  const opportunityManagerOption = page.locator('li[data-label="Opportunity Manager"]').first();
  await opportunityManagerOption.click();

  await expect(filterOperatorInput).toBeVisible();
  await expect(filterOperatorInput).toBeEnabled();
  await filterOperatorInput.click();
  const isOption = page.locator('li[data-label="is"]').first();
  await expect(isOption).toBeVisible();
  await isOption.click();

  await expect(filterValueInput).toBeVisible();
  await expect(filterValueInput).toBeEnabled();
  await filterValueInput.click();
  const opportunityManagerValueOption = page.locator(`li[data-label="${testData.userPicker}"]`).first();
  await expect(opportunityManagerValueOption).toBeVisible();
  await opportunityManagerValueOption.click();

  await expect(applyFilterButton).toBeEnabled();
  await applyFilterButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();
  const opportunityManagerRows = page.locator('tbody tr').filter({ hasText: 'Opportunity Manager:' });
  const opportunityManagerCount = await opportunityManagerRows.count();
  expect(opportunityManagerCount).toBeGreaterThan(0);
  for (let i = 0; i < opportunityManagerCount; i++) {
    const rowText = ((await opportunityManagerRows.nth(i).innerText()) || '').toLowerCase();
    expect(rowText).toContain(testData.userPicker.toLowerCase());
  }
  console.log(`[data] opportunityManagerFilteredRows: ${opportunityManagerCount}`);

  await page.getByRole('button', { name: 'Filters 1', exact: true }).click();
  await expect(resetFiltersButton).toBeEnabled();
  await resetFiltersButton.click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('button', { name: 'Filters 0', exact: true })).toBeVisible();

  const mineFilterButton = page.locator("//label[normalize-space()='Mine']/following-sibling::button");
  await expect(mineFilterButton).toBeEnabled();
  await mineFilterButton.click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Filters 0', exact: true }).click();
  await page.waitForTimeout(1000);
  await filterColumnInput.click();
  const plantOption = page.locator('li[data-label="Plant"]:visible').first();
  await expect(plantOption).toBeVisible();
  await plantOption.click();

  await filterOperatorInput.click();
  await expect(page.locator('li[data-label="is"]:visible').first()).toBeVisible();
  await page.locator('li[data-label="is"]:visible').first().click();

  await filterValueInput.click();
  const plantValueOption = page.locator('li[data-label="Novi, MI"]:visible').first();
  await expect(plantValueOption).toBeVisible();
  await plantValueOption.click();

  await expect(addAFilterButton).toBeVisible();
  await expect(addAFilterButton).toBeEnabled();
  await addAFilterButton.click();
  await page.waitForTimeout(2000);

  const filterColumnInput2 = page.locator('input[name="rows.1.column"][type="text"]').first();
  await expect(filterColumnInput2).toBeVisible();
  await expect(filterColumnInput2).toBeEnabled();
  await filterColumnInput2.click();
  await page.waitForTimeout(1000);
  const cxSupportOption = page.locator('li[data-label="CX Support"]:visible').first();
  await expect(cxSupportOption).toBeVisible();
  await cxSupportOption.click();
  await page.waitForTimeout(1000);

  const filterOperatorInput2 = page.locator('input[name="rows.1.operator"][type="text"]').first();
  await expect(filterOperatorInput2).toBeVisible();
  await expect(filterOperatorInput2).toBeEnabled();
  await filterOperatorInput2.click();
  await expect(page.locator('li[data-label="is"]:visible').first()).toBeVisible();
  await page.locator('li[data-label="is"]:visible').first().click();

  const filterValueInput2 = page.locator('input[name="rows.1.value"][type="text"]').first();
  await expect(filterValueInput2).toBeVisible();
  await expect(filterValueInput2).toBeEnabled();
  await filterValueInput2.click();
  await page.waitForTimeout(1000);
  const cxSupportValueReadonly = await filterValueInput2.getAttribute('readonly');
  if (cxSupportValueReadonly) {
    const cxSupportValueOption = page.locator('li[data-label="Sydney Irving"]:visible').first();
    if (await cxSupportValueOption.isVisible()) {
      await cxSupportValueOption.click();
    } else {
      await page.locator('li[data-label]:visible').first().click();
    }
  } else {
    await filterValueInput2.fill('Sydney Irving');
  }

  await expect(applyFilterButton).toBeEnabled();
  await applyFilterButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Filters 2', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();
  const multiFilterRows = page.locator('tbody tr').filter({ hasText: 'Plant:' });
  const multiFilterRowCount = await multiFilterRows.count();
  expect(multiFilterRowCount).toBeGreaterThan(0);
  for (let i = 0; i < multiFilterRowCount; i++) {
    const rowText = ((await multiFilterRows.nth(i).innerText()) || '').toLowerCase();
    expect(rowText).toContain('novi');
    expect(rowText).toContain('sydney');
  }
  console.log(`[data] multiFilterRowCount: ${multiFilterRowCount}`);

  await page.getByRole('button', { name: 'Filters 2', exact: true }).click();
  await expect(resetFiltersButton).toBeEnabled();
  await resetFiltersButton.click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('button', { name: 'Filters 0', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await page.getByRole('button', { name: 'Filters 0', exact: true }).click();
  await page.waitForTimeout(1000);
  expect(((await filterColumnInput.inputValue()) || '').trim()).toBe('');
  expect(((await filterOperatorInput.inputValue()) || '').trim()).toBe('');
  expect(((await filterValueInput.inputValue()) || '').trim()).toBe('');

  await filterColumnInput.click();
  const opportunityNameOption = page.locator('li[data-label="Opportunity Name"]').first();
  await expect(opportunityNameOption).toBeVisible();
  await opportunityNameOption.click();

  await filterOperatorInput.click();
  const containsOption = page.locator('li[data-label="contains"]').first();
  await expect(containsOption).toBeVisible();
  await containsOption.click();

  await expect(filterValueInput).toBeVisible();
  await expect(filterValueInput).toBeEnabled();
  await filterValueInput.click();
  await filterValueInput.fill('Innovation');

  await expect(applyFilterButton).toBeEnabled();
  await applyFilterButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();
  const nameFilterRows = page.locator('tbody tr').filter({ hasText: 'Opportunity:' });
  const nameFilterRowCount = await nameFilterRows.count();
  expect(nameFilterRowCount).toBeGreaterThan(0);
  for (let i = 0; i < nameFilterRowCount; i++) {
    const rowText = ((await nameFilterRows.nth(i).innerText()) || '').toLowerCase();
    expect(rowText).toContain('innovation');
  }
  console.log(`[data] opportunityNameFilteredRows: ${nameFilterRowCount}`);

  await page.getByRole('button', { name: 'Filters 1', exact: true }).click();
  await expect(resetFiltersButton).toBeEnabled();
  await resetFiltersButton.click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('button', { name: 'Filters 0', exact: true })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await page.getByRole('button', { name: 'Filters 0', exact: true }).click();
  await page.waitForTimeout(1000);
  expect(((await filterColumnInput.inputValue()) || '').trim()).toBe('');
  expect(((await filterOperatorInput.inputValue()) || '').trim()).toBe('');
  expect(((await filterValueInput.inputValue()) || '').trim()).toBe('');
});
