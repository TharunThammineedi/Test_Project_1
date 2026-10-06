// Edit RFP general info and change Draft to Requested
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test.describe('RFP Edit and Status @regression', () => {
  test.describe.configure({ mode: 'serial' });

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
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
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Edit RFP general info @regression @set2', async () => {
    const session = prepareSession({ force: true });
    Object.assign(testData, session);
    console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

    const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
    await expect(estimateMenuLink).toBeVisible();
    await estimateMenuLink.click();

    const rfpMenuLink = page.getByRole('link', { name: 'Request For Proposals', exact: true });
    await expect(rfpMenuLink).toBeVisible();
    await expect(rfpMenuLink).toBeEnabled();
    await rfpMenuLink.click();

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

    const addAFilterButton = page.locator('p').filter({ hasText: 'Add A Filter' });
    await addAFilterButton.click();

    const columnSelect_2 = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select").last();
    await columnSelect_2.click();
    await columnSelect_2.selectOption("status");

    const operatorSelect_2 = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select").last();
    await operatorSelect_2.click();
    await operatorSelect_2.selectOption("is equal to");

    const valueSelect_2 = page.locator("xpath=//option[normalize-space(.)='Value']/ancestor::select").last();
    await valueSelect_2.click();
    await valueSelect_2.selectOption("requested");

    const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    await expect(page.getByRole('button', { name: 'Filters 2', exact: true })).toBeVisible();

    const firstRfpCell = page.locator('//tbody//tr[1]//td[2]');
    await expect(firstRfpCell).toBeVisible();
    const rfpNumber = (await firstRfpCell.innerText()).trim();
    await firstRfpCell.click();
    await page.waitForTimeout(2000);

    const proposalTitleSpan = page.locator('span').filter({ hasText: `${rfpNumber} - Request for Proposal` }).first();
    await expect(proposalTitleSpan).toBeVisible();

    const descriptionDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Description"]//following-sibling::div//span').first();
    await expect(descriptionDiv).toBeVisible();

    const editButton = page.locator('//button[@data-cy="estimateEditButton"]');
    await expect(editButton).toBeEnabled();
    await editButton.click();

    const estimateDescriptionTextarea = page.locator('//textarea[@name="deliverableItem.description"]');
    await expect(estimateDescriptionTextarea).toBeVisible();
    await expect(estimateDescriptionTextarea).toBeEnabled();
    await estimateDescriptionTextarea.fill(testData.estimate);
    await expect(estimateDescriptionTextarea).toHaveValue(testData.estimate);

    const printMethodInput = page.locator('//div[normalize-space()="Print Method"]/following-sibling::div//input');
    await expect(printMethodInput).toBeVisible();
    await expect(printMethodInput).toBeEnabled();
    await printMethodInput.click();
    await page.waitForTimeout(2000);
    const combinationListItem = page.locator('li[data-label="Combination"]');
    await expect(combinationListItem).toBeVisible();
    await page.waitForTimeout(2000);
    await combinationListItem.click();
    await page.waitForTimeout(2000);

    const saveButton = page.locator('button[x-tooltip="Save"]').first();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();

    const cancelEditButton = page.locator('button[x-tooltip="Cancel"]').first();
    await expect(cancelEditButton).toBeVisible();

    await saveButton.click();

    const printMethodDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Print Method"]//following-sibling::div//span').first();
    await expect(printMethodDiv).toBeVisible();
    await page.waitForTimeout(5000);

    await expect(descriptionDiv).toContainText(testData.estimate);
  });

  test('Draft to Requested @regression @set1', async () => {
    const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
    await expect(estimateMenuLink).toBeVisible();
    await estimateMenuLink.click();

    const requestForProposalsLink = page.getByRole('link', {
      name: 'Request For Proposals',
      exact: true
    });

    await expect(requestForProposalsLink).toBeVisible();
    await expect(requestForProposalsLink).toBeEnabled();
    await requestForProposalsLink.click();

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

    const addAFilterButton = page.locator('p').filter({ hasText: 'Add A Filter' });
    await addAFilterButton.click();

    const columnSelect_2 = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select").last();
    await columnSelect_2.click();
    await columnSelect_2.selectOption("status");

    const operatorSelect_2 = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select").last();
    await operatorSelect_2.click();
    await operatorSelect_2.selectOption("is equal to");

    const valueSelect_2 = page.locator("xpath=//option[normalize-space(.)='Value']/ancestor::select").last();
    await valueSelect_2.click();
    await valueSelect_2.selectOption("draft");

    const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    await expect(page.getByRole('button', { name: 'Filters 2', exact: true })).toBeVisible();

    const activeToggle = page.locator('//span[normalize-space()="Active Only"]/..//div/button').first();
    await expect(activeToggle).toBeVisible();
    const isActiveOn = await activeToggle.evaluate((el) => el.classList.contains('bg-denim-blue-600'));
    if (isActiveOn) {
      await activeToggle.click();
    }
    await expect(activeToggle).toHaveClass(/bg-gray-200/);
    await page.waitForTimeout(2000);

    const firstRfpCell = page.locator('//tbody//tr[1]//td[2]');
    await expect(firstRfpCell).toBeVisible();
    const rfpNumber = (await firstRfpCell.innerText()).trim();
    await firstRfpCell.click();
    await page.waitForTimeout(2000);

    const proposalTitleSpan = page.locator('span').filter({ hasText: `${rfpNumber} - Request for Proposal` }).first();
    await expect(proposalTitleSpan).toBeVisible();

    const statusDraftDiv = page.locator('div').filter({ hasText: 'Status Draft' }).first();
    await expect(statusDraftDiv).toBeVisible();
    await expect(statusDraftDiv).toBeEnabled();
    await statusDraftDiv.click();

    const estimateEditButton = page.locator('[data-cy="estimateEditButton"]');
    await expect(estimateEditButton).toBeEnabled();
    await estimateEditButton.click();

    const statusInput = page.locator('input[name="status"][type="text"]');
    await expect(statusInput).toBeVisible();
    await statusInput.click();

    const requestedListItem = page.locator('li[data-label="Requested"]');
    await expect(requestedListItem).toBeVisible();
    await expect(requestedListItem).toBeEnabled();
    await requestedListItem.click();

    const estimateSaveButton =page.locator('button[x-tooltip="Save"]').first();
    await expect(estimateSaveButton).toBeEnabled();
    await estimateSaveButton.click();

    const estimateUpdatedMessage = page.locator('p').filter({ hasText: 'Request for Proposal updated successfully.' }).first();
    await expect(estimateUpdatedMessage).toBeVisible();

    await expect(estimateEditButton).toBeEnabled();
    await estimateEditButton.click();

    await expect(statusInput).toBeVisible();

    const statusRequestedDiv = page.locator('div').filter({ hasText: 'Status Requested' }).first();
    await expect(statusRequestedDiv).toBeVisible();

    const estimateSaveButton_2 =page.locator('button[x-tooltip="Save"]').first();
    await expect(estimateSaveButton_2).toBeEnabled();
    await estimateSaveButton_2.click();

    const draftIcon = page.locator(
      '//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]');
    await expect(draftIcon).not.toBeVisible;
    await expect(draftIcon).toHaveCount(0);
  });
});
