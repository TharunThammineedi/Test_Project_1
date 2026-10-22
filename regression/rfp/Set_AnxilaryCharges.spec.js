// Set Ancillary Charges in RFP TestCase_18
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Set Ancillary Charges in RFP @regression @set1', async ({ page }) => {
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
    .filter({ hasText: /^Tharun\'s Task Dashboard$/ })
    .first();

  await expect(taskDashboardLabel).toBeVisible();
  await expect(taskDashboardLabel).toBeEnabled();

  const btn = page.locator(
    '(//button[normalize-space()="Estimating & Pricing"])[1]'
  );

  await btn.click();

  // Request For Proposals navigation
  const requestForProposalsLink = page.getByRole('link', {
    name: 'Request For Proposals',
    exact: true
  });

  await expect(requestForProposalsLink).toBeVisible();
  await expect(requestForProposalsLink).toBeEnabled();
  await requestForProposalsLink.click();

  // Request for Proposals Queue
  const rfpQueueLabel = page
    .locator('label')
    .filter({ hasText: /^Request for Proposals Queue$/ })
    .first();

  await expect(rfpQueueLabel).toBeVisible();
  await expect(rfpQueueLabel).toBeEnabled();
  await rfpQueueLabel.click();

  await page.waitForLoadState('domcontentloaded');

  const loggedInUserName = (
    await page.locator('#user-menu-button .font-semibold').first().innerText()
  ).trim();
  console.log(`[data] loggedInUserName: ${loggedInUserName}`);
  expect(loggedInUserName.length).toBeGreaterThan(0);

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeEnabled();
  await filtersButton.click();

  const columnSelect = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect.click();
  await columnSelect.selectOption("Requested By");

  const operatorSelect = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect.click();
  await operatorSelect.selectOption("is equal to");

  const valueSelect = page.getByPlaceholder('value');
  await valueSelect.fill(loggedInUserName);

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();
  await page.waitForTimeout(2000);

  const firstRfpCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstRfpCell).toBeVisible();
  const rfpNumber = (await firstRfpCell.innerText()).trim();
  console.log(`[data] RFP Number: ${rfpNumber}`);
  await firstRfpCell.click();
  await page.waitForTimeout(2000);

  const proposalTitleSpan = page.locator('span').filter({ hasText: `${rfpNumber} - Request for Proposal` }).first();
  await expect(proposalTitleSpan).toBeVisible();

  const linkAncillaryItemButton = page.getByRole('button', { name: 'Link Ancillary Item', exact: true });
  await expect(linkAncillaryItemButton).toBeEnabled();
  await linkAncillaryItemButton.click();

  await expect(page.getByRole('heading', { name: 'Choose Ancillary Item' })).toBeVisible();

  const itemChangeChargeCheckbox = page.locator('//label[normalize-space()="Item Change Charge"]/input');
  await itemChangeChargeCheckbox.check();
  await expect(itemChangeChargeCheckbox).toBeChecked();

  const programingFeeLabel = page.locator('label').filter({ hasText: /^Programing Fee$/ }).first();
  await expect(programingFeeLabel).toBeVisible();
  await expect(programingFeeLabel).toBeEnabled();

  const programingFeeCheckbox = page.locator('//label[normalize-space()="Programing Fee"]/input');
  await programingFeeCheckbox.check();
  await expect(programingFeeCheckbox).toBeChecked();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeVisible();
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  const itemChangeChargeSpan = page.locator('span').filter({ hasText: '16 - Item change charge' }).first();
  await expect(itemChangeChargeSpan).toBeVisible();
  await expect(itemChangeChargeSpan).toBeEnabled();

  const ancillary16QuantityInput = page.locator('input[name="editingAncillaryItemsEstimate.16.quantity"][type="text"]');
  await expect(ancillary16QuantityInput).toBeVisible();
  await expect(ancillary16QuantityInput).toBeEditable();
  await ancillary16QuantityInput.fill(testData.editingAncillaryItemsQuantity);

  const ancillary16PriceInput = page.locator('input[name="editingAncillaryItemsEstimate.16.price"][type="text"]');
  await expect(ancillary16PriceInput).toBeVisible();
  await expect(ancillary16PriceInput).toBeEditable();
  await ancillary16PriceInput.fill(testData.editingAncillaryItemsEstimate16Price);

  const ancillary15QuantityInput = page.locator('input[name="editingAncillaryItemsEstimate.15.quantity"][type="text"]');
  await expect(ancillary15QuantityInput).toBeVisible();
  await expect(ancillary15QuantityInput).toBeEditable();
  await ancillary15QuantityInput.fill(testData.editFlatCost);

  const ancillary15PriceInput = page.locator('input[name="editingAncillaryItemsEstimate.15.price"][type="text"]');
  await expect(ancillary15PriceInput).toBeVisible();
  await expect(ancillary15PriceInput).toBeEditable();
  await ancillary15PriceInput.fill(testData.costPerEach);

  const saveAncillaryItemButton = page.locator("//div[@id='info-ancillary-items']//button[@x-tooltip='Save']");
  await expect(saveAncillaryItemButton).toBeEnabled();
  await saveAncillaryItemButton.scrollIntoViewIfNeeded();
  await saveAncillaryItemButton.click({ force: true });

  const ancillaryItemsUpdatedMsg = page.locator('p').filter({ hasText: 'Ancillary Items Updated Successfully' }).first();
  await expect(ancillaryItemsUpdatedMsg).toBeVisible();

  const programingFeeDiv = page.locator('div').filter({ hasText: 'Programing Fee' }).first();
  await expect(programingFeeDiv).toBeVisible();
  await expect(programingFeeDiv).toBeEnabled();

  const itemChangeChargeTooltipSpan = page.locator('span').filter({ hasText: 'Item change charge' }).first();
  await expect(itemChangeChargeTooltipSpan).toBeVisible();
  await expect(itemChangeChargeTooltipSpan).toBeEnabled();
});
