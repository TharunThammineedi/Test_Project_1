// Link option charges on Estimate show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Link Estimate options @regression @set1', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  // Initial navigation and login
await page.goto(testData.url);

const signInWithEmailButton = page.locator('[data-cy="btnLoginVisible"]');
await expect(signInWithEmailButton).toBeVisible();
await expect(signInWithEmailButton).toBeEnabled();
await signInWithEmailButton.click();

const emailInput = page.locator('input[name="email"][type="email"]');
await expect(emailInput).toBeEnabled();
await emailInput.click();
await emailInput.fill(testData.email);

const passwordInput = page.locator('input[name="password"][type="password"]');
await expect(passwordInput).toBeEnabled();
await passwordInput.click();
await passwordInput.fill(testData.password);

const confirmSignInButton = page.locator('[data-cy="btnLoginConfirm"]');
await expect(confirmSignInButton).toBeEnabled();
await confirmSignInButton.click();

// Dashboard navigation
const taskDashboardLabel = page
  .locator('label')
  .filter({ hasText: /^Ranga\'s Task Dashboard$/ })
  .first();

await expect(taskDashboardLabel).toBeVisible();
await expect(taskDashboardLabel).toBeEnabled();

const btn = page.locator(
  '(//button[normalize-space()="Estimating & Pricing"])[1]'
);
await btn.click();


const estimatesQuotesLink = page.getByRole('link', {
    name: 'Estimates/Quotes',
    exact: true
  });
  await expect(estimatesQuotesLink).toBeVisible();
  await expect(estimatesQuotesLink).toBeEnabled();
  await estimatesQuotesLink.click();

  const estimatesQuotesIndexpage = page
  .locator('label')
  .filter({ hasText: 'Estimates/Quotes' })
  .first();

await expect(estimatesQuotesIndexpage).toBeVisible();
await expect(estimatesQuotesIndexpage).toBeEnabled();
await estimatesQuotesIndexpage.click();

await page.waitForLoadState('domcontentloaded');

const newEstimateLink = page.getByRole('link', { name: 'New Estimate', exact: true });
await expect(newEstimateLink).toBeVisible();

const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
    await expect(filtersButton).toBeEnabled();
    await filtersButton.click();

    const columnSelect = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
    await columnSelect.click();
    await (columnSelect).selectOption("status");

    const operatorSelect = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
    await operatorSelect.click();
    await (operatorSelect).selectOption("is equal to");

    const valueSelect = page.locator("xpath=//option[normalize-space(.)='Value']/ancestor::select");
    await valueSelect.click();
    await (valueSelect).selectOption("Needs Approval");
 
    const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();
  
    //Assertion Applying Filters
    await expect(page.getByRole('button', { name: 'Filters 1', exact: true }) ).toBeVisible();
    await page.waitForTimeout(3000);

    const column10 = page.locator('//thead/tr/th[10]//following::tbody/tr/td[10]/div//span');
    const column10Text = await column10.allTextContents();
   for (const text of column10Text) {
    expect(text.trim()).toBe("Needs Approval");
}

    const firstEstimateLink = page.locator('//table//tbody/tr[1]/td[2]');
    await expect(firstEstimateLink).toBeVisible();
    await expect(firstEstimateLink).toBeEnabled();
    await firstEstimateLink.click();

    const estimateText = await page.locator('//div[@class="section"]//h1//span').innerText();
const estimateNumber = estimateText.replace(/\s*-\s*Estimate\s*$/, '').trim();
console.log("Estimate Number:", estimateNumber);

const draftIcon = page.locator(
    '//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]');
  await expect(draftIcon).not.toBeVisible();
  await expect(draftIcon).toHaveCount(0);

  const statusDraftDiv = page.locator('div').filter({ hasText: 'Needs Approval' }).first();
  await expect(statusDraftDiv).toBeVisible(); 

  const linkOptionsButton = page.getByRole('button', { name: 'Link Options', exact: true });
  await expect(linkOptionsButton).toBeEnabled();
  await linkOptionsButton.click();
 
  const chooseOptionHeading = page.locator('h3').filter({ hasText: 'Choose Option' }).first();
  await expect(chooseOptionHeading).toBeVisible();

 const nameSearch = page.locator('(//h3[normalize-space()="Choose Option"]//following::input[@placeholder="Quick Search"])[1]').first();
 await nameSearch.fill("Horizontal Perf");
 await page.waitForTimeout(2000);

  const horizontalPerfCheckbox = page.locator('//label[normalize-space()="Horizontal Perf"]/input');
  await horizontalPerfCheckbox.check();
  await expect(horizontalPerfCheckbox).toBeChecked();

  await nameSearch.clear();
  await page.waitForTimeout(2000);
 await nameSearch.fill("Screen Print");
 await page.waitForTimeout(2000);

  const verticalPerfCheckbox = page.locator('//label[normalize-space()="Screen Print"]/input');
  await verticalPerfCheckbox.check();
  await expect(verticalPerfCheckbox).toBeChecked();
 
  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();
 
  const horizontalPerfOptionRow = page.locator('div').filter({ hasText: '19 - Horizontal Perf' }).first();
  await expect(horizontalPerfOptionRow).toBeVisible();
  // await horizontalPerfOptionRow.click();
 
  const verticalPerfOptionSpan = page.locator('div').filter({ hasText: '15 - Screen Print' }).first();
  await expect(verticalPerfOptionSpan).toBeVisible();
  // await verticalPerfOptionSpan.click();
 
  const flatCost19Input = page.locator('input[name="editingEstimateOptions.19.flat_cost"][type="text"]');
  await expect(flatCost19Input).toBeEditable();
  await flatCost19Input.fill(testData.editFlatCost);

  const costPerEach19Input = page.locator('input[name="editingEstimateOptions.19.cost_per_each"][type="text"]');
  await expect(costPerEach19Input).toBeEditable();
  await costPerEach19Input.fill(testData.costPerEach);

  const costPerUnitSet19Input = page.locator('input[name="editingEstimateOptions.19.cost_per_unit_set"][type="text"]');
  await expect(costPerUnitSet19Input).toBeEditable();
  await costPerUnitSet19Input.fill(testData.costPerUnitSet);

  const flatCost17Input = page.locator('input[name="editingEstimateOptions.15.flat_cost"][type="text"]');
  await flatCost17Input.fill(testData.editFlatCost);

  const costPerEach17Input = page.locator('input[name="editingEstimateOptions.15.cost_per_each"][type="text"]');
  await costPerEach17Input.fill(testData.costPerEach);

  const costPerUnitSet17Input = page.locator('input[name="editingEstimateOptions.15.cost_per_unit_set"][type="text"]');
  await costPerUnitSet17Input.fill(testData.costPerUnitSet);

  const saveEstimateOptionsButton = page.locator('button[x-tooltip="Save"][wire\\:click="saveEstimateOptions"]');
  await expect(saveEstimateOptionsButton).toBeEnabled();
  await saveEstimateOptionsButton.scrollIntoViewIfNeeded();
  await saveEstimateOptionsButton.click({ force: true });
 
  const optionsUpdatedMsg = page.locator('p').filter({ hasText: 'Options Updated Successfully' }).first();
  await expect(optionsUpdatedMsg).toBeVisible();

  const summaryHorizontalPerfDiv = page.locator('div').filter({ hasText: '19 - Horizontal Perf' }).first();
  await expect(summaryHorizontalPerfDiv).toBeVisible();
  await expect(summaryHorizontalPerfDiv).toBeEnabled();

  const summaryVerticalPerfDiv = page.locator('div').filter({ hasText: '15 - Screen Print' }).first();
  await expect(summaryVerticalPerfDiv).toBeVisible();

  const linkAncillaryItemQuickSearchInput = page.locator('(//input[@data-cy="input" and @placeholder="Quick Search"])[5]');
  await expect(linkAncillaryItemQuickSearchInput).toBeVisible();
  await expect(linkAncillaryItemQuickSearchInput).toBeEditable();
  await linkAncillaryItemQuickSearchInput.fill("Horizontal Perf");
  await page.waitForTimeout(2000);

  const screenPrintDiv_afterquickSearch = page.locator('//span[contains(normalize-space(),"Screen Print")]').first();
  await expect(screenPrintDiv_afterquickSearch).not.toBeVisible();

  await linkAncillaryItemQuickSearchInput.clear();

  const horizontalPerfDiv_afterClearQuickSearch = page.locator('//span[contains(normalize-space(),"Horizontal Perf")]').first();
  await expect(horizontalPerfDiv_afterClearQuickSearch).toBeVisible();

  const itemChangeChargeTooltipSpan_afterClearQuickSearch = page.locator('//span[contains(normalize-space(),"Screen Print")]').first();
  await expect(itemChangeChargeTooltipSpan_afterClearQuickSearch).toBeVisible();
  
const editbuttonAncillaryItem = page.locator('button[x-tooltip="Edit"]').nth(5);
await expect(editbuttonAncillaryItem).toBeVisible();
await expect(editbuttonAncillaryItem).toBeEnabled();
await editbuttonAncillaryItem.click();

const removeAncillaryItem = page.locator('(//span[contains(normalize-space(),"Horizontal Perf")])[2]//../..//descendant::div//button[@x-tooltip="Remove"]');
await expect(removeAncillaryItem).toBeVisible();
await expect(removeAncillaryItem).toBeEnabled();
await removeAncillaryItem.click();

await page.waitForTimeout(2000);

const saveButtonAncillaruItemAfterRemove = page.locator('button[x-tooltip="Save"]').nth(2);
await expect(saveButtonAncillaruItemAfterRemove).toBeVisible();
await expect(saveButtonAncillaruItemAfterRemove).toBeEnabled();
await saveButtonAncillaruItemAfterRemove.click();

const ancillaryItemsUpdatedMsg_afterRemove = page.locator('p').filter({ hasText: 'Options Updated Successfully' }).first();
await expect(ancillaryItemsUpdatedMsg_afterRemove).toBeVisible();

const itemChangeChargeTooltipSpan_afterRemove = page.locator('//span[contains(normalize-space(),"Horizontal Perf")]').first();
await expect(itemChangeChargeTooltipSpan_afterRemove).not.toBeVisible();

const programmingFeeDiv_afterRemove = page.locator('//span[contains(normalize-space(),"Screen Print")]').first();
await expect(programmingFeeDiv_afterRemove).toBeVisible();

});