// Edit Estimate general info and status progression
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test.describe('Estimate Edit and Status @regression', () => {
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

  test('Edit Estimate general info @regression @set1', async () => {
    const session = prepareSession({ force: true });
    Object.assign(testData, session);
    console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

    const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
    await expect(estimateMenuLink).toBeVisible();
    await estimateMenuLink.click();

    const estimatesQuotesLink = page.getByRole('link', { name: 'Estimates/Quotes', exact: true });
    await expect(estimatesQuotesLink).toBeVisible();
    await expect(estimatesQuotesLink).toBeEnabled();
    await estimatesQuotesLink.click();

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
    await firstEstimateCell.click();
    await page.waitForTimeout(2000);

    const estimateTitleSpan = page.locator('span').filter({ hasText: `${estimateNumber} - Estimate` }).first();
    await expect(estimateTitleSpan).toBeVisible();

    const descriptionDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Description"]//following-sibling::div//span').first();
    await expect(descriptionDiv).toBeVisible();

    const editButton = page.locator('//button[@data-cy="estimateEditButton"]');
    await expect(editButton).toBeEnabled();
    await editButton.click();

    const estimateDescriptionTextarea = page.locator("xpath=//textarea[@id='deliverableItem.description']");
    await expect(estimateDescriptionTextarea).toBeVisible();
    await expect(estimateDescriptionTextarea).toBeEnabled();
    await estimateDescriptionTextarea.fill(testData.descriptionRequired);
    await expect(estimateDescriptionTextarea).toHaveValue(testData.descriptionRequired);

    const saveButton = page.locator('button[x-tooltip="Save"]').first();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();

    const cancelEditButton = page.locator('button[x-tooltip="Cancel"]').first();
    await expect(cancelEditButton).toBeVisible();

    await saveButton.click();
    await page.waitForTimeout(4000);

    await expect(descriptionDiv).toContainText(testData.descriptionRequired);
  });

  test('Estimate status progression @regression @set1', async () => {
    const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
    await expect(estimateMenuLink).toBeVisible();
    await estimateMenuLink.click();
    await page.waitForTimeout(2000);

    const estimatesQuotesLink = page.getByRole('link', { name: 'Estimates/Quotes', exact: true });
    await expect(estimatesQuotesLink).toBeVisible();
    await expect(estimatesQuotesLink).toBeEnabled();
    await estimatesQuotesLink.click();

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
    await firstEstimateCell.click();
    await page.waitForTimeout(2000);

    const estimateTitleSpan = page.locator('span').filter({ hasText: `${estimateNumber} - Estimate` }).first();
    await expect(estimateTitleSpan).toBeVisible();

    const statusDiv = page.locator('//div[@id="info-estimate"]//div[normalize-space()="Status"]//following-sibling::div//span').first();
    const selectedStatus = (suffix) => page.locator(`li[id^="selected-${suffix}"]`);

    await expect(statusDiv).toHaveText('Draft');
    await expect(selectedStatus('draft')).toBeVisible();

    const editButton = page.locator('[data-cy="estimateEditButton"]');
    await expect(editButton).toBeEnabled();
    await editButton.click();

    const statusInput = page.locator('input[name="status"][type="text"]');
    await expect(statusInput).toBeVisible();
    await statusInput.click();
    await page.locator('li[data-label="Needs Approval"]').click();

    let saveButton = page.locator('button[x-tooltip="Save"][id^="estimate::edit-save-"]');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Wait on workflow selected-li (survives parallel lag better than a fixed sleep)
    await expect(selectedStatus('needs_approval')).toBeVisible({ timeout: 180000 });
    await expect(statusDiv).toHaveText('Needs Approval', { timeout: 60000 });

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(selectedStatus('needs_approval')).toBeVisible({ timeout: 60000 });
    await expect(statusDiv).toHaveText('Needs Approval');

    await expect(editButton).toBeEnabled();
    await editButton.click();
    await expect(statusInput).toBeVisible();
    await statusInput.click();
    await page.locator('li[data-label="Pause"]').click();
    await page.waitForTimeout(1000);

    saveButton = page.locator('button[x-tooltip="Save"][id^="estimate::edit-save-"]');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(selectedStatus('paused')).toBeVisible({ timeout: 180000 });
    await expect(statusDiv).toHaveText('Paused', { timeout: 60000 });

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(selectedStatus('paused')).toBeVisible({ timeout: 60000 });
    await expect(statusDiv).toHaveText('Paused');
  });
});
