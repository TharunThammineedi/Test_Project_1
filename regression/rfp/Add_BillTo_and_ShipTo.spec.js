// Add Bill To and Ship To on RFP show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Add Bill To and Ship To @regression @set2', async ({ page }) => {
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

  const loginConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(loginConfirmButton).toBeEnabled();
  await loginConfirmButton.click();

  const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
  await expect(estimateMenuLink).toBeVisible();
  await estimateMenuLink.click();

  const rfpMenuLink = page.getByRole('link', { name: 'Request For Proposals', exact: true });
  await expect(rfpMenuLink).toBeVisible();
  await expect(rfpMenuLink).toBeEnabled();
  await rfpMenuLink.click();

  const mineFilter = page.locator('//span[normalize-space()="Mine"]//following::button[1]');
  await expect(mineFilter).toBeVisible();
  await mineFilter.click();

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeEnabled();
  await filtersButton.click();

  const columnSelect = page.locator('select[data-flux-select-native][x-model="selection.column"]').first();
  await columnSelect.selectOption("status");

  const operatorSelect = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect.selectOption("is equal to");

  const valueSelect = page.locator("xpath=//option[normalize-space(.)='Value']/ancestor::select");
  await valueSelect.selectOption("requested");

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

  const firstRfpCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstRfpCell).toBeVisible();
  const rfpNumber = (await firstRfpCell.innerText()).trim();
  await firstRfpCell.click();
  await page.waitForTimeout(2000);

  const proposalTitleSpan = page.locator('span').filter({ hasText: `${rfpNumber} - Request for Proposal` }).first();
  await expect(proposalTitleSpan).toBeVisible();

  const editButton = page.locator('(//div[normalize-space()="Bill To"])[1]//following-sibling::button');
  await expect(editButton).toBeEnabled();
  await editButton.click();

  const customerAddressDiv = page.locator('(//span[@x-tooltip="Choose"])[2]');
  await expect(customerAddressDiv).toBeVisible();
  await expect(customerAddressDiv).toBeEnabled();

  const selectAddressButton = page.getByRole('button', { name: 'Select Address', exact: true });
  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });

  if(!(await selectAddressButton.isVisible())) {
    await customerAddressDiv.click();
    await expect(unlinkButton).toBeEnabled();
    await unlinkButton.click();
  }

  await expect(selectAddressButton).toBeEnabled();
  await selectAddressButton.click();

  const firstRadio = page.locator('input[type="radio"][name="selectedId"]').first();
  await expect(firstRadio).toBeVisible();
  await firstRadio.check();

  const continueDialogButton = page.locator('//div[@label="Choose Address"]//..//button[normalize-space()="Continue"]').first();
  await expect(continueDialogButton).toBeEnabled();
  await continueDialogButton.click();

  const saveBillToAddressButton = page.locator('(//button[@x-tooltip="Save"])[2]').first();
  await expect(saveBillToAddressButton).toBeEnabled();
  await saveBillToAddressButton.click();

  const shipToEditButton = page.locator('(//div[normalize-space()="Ship To"])[1]//following-sibling::button');
  await expect(shipToEditButton).toBeEnabled();
  await shipToEditButton.click();

  const shipToCustomerAddressDiv = page.locator('(//span[@x-tooltip="Choose"])[3]');
  await expect(shipToCustomerAddressDiv).toBeVisible();
  await expect(shipToCustomerAddressDiv).toBeEnabled();

  const selectAddressButtonShipTo = page.getByRole('button', { name: 'Select Address', exact: true });
  const unlinkButtonShipTo = page.getByRole('button', { name: 'Unlink', exact: true });

  if (!(await selectAddressButtonShipTo.isVisible())) {
    await shipToCustomerAddressDiv.click();
    await expect(unlinkButtonShipTo).toBeEnabled();
    await unlinkButtonShipTo.click();
  }

  await expect(selectAddressButtonShipTo).toBeEnabled();
  await selectAddressButtonShipTo.click();

  const lastRadioShipTo = page.locator('input[type="radio"][name="selectedId"]').last();

  await expect(lastRadioShipTo).toBeVisible();
  await lastRadioShipTo.check();

  const continueDialogButtonShipTo = page.locator('//div[@label="Choose Address"]//..//button[normalize-space()="Continue"]').last();
  await expect(continueDialogButtonShipTo).toBeEnabled();
  await continueDialogButtonShipTo.click();

  const saveShipToAddressButton = page.locator('(//button[@x-tooltip="Save"])[3]').first();
  await expect(saveShipToAddressButton).toBeEnabled();
  await saveShipToAddressButton.click();

  const shipToAddressText = page.locator('(//div[normalize-space()="Ship To"])[1]//..//span[@class="text-right"]').first();
  const billToAddressText = page.locator('(//div[normalize-space()="Bill To"])[1]//..//span[@class="text-right"]').first();
  if (await billToAddressText.isVisible()) {
    const billToAddress = (await billToAddressText.innerText()).trim();
    console.log(`[data] billToAddress: ${billToAddress}`);

    await expect(shipToEditButton).toBeEnabled();
    await shipToEditButton.click();

    const sameAsBillToButton = page.locator('//label[normalize-space()="Same as Bill To"]/preceding-sibling::input');
    await expect(sameAsBillToButton).toBeVisible();
    await expect(sameAsBillToButton).toBeEnabled();
    await sameAsBillToButton.check();
    await expect(saveShipToAddressButton).toBeEnabled();
    await saveShipToAddressButton.click();

    await expect(shipToAddressText).toBeVisible();
    await expect(shipToAddressText).toContainText(billToAddress);
    console.log(`[data] shipToAddress matches billTo: ${billToAddress}`);
  } else {
    console.log('[data] Bill To address not set — skipping Same as Bill To');
  }
});
