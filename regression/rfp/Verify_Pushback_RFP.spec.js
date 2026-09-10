// TestCase_30 — Pushback and Cancel Request in RFP
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Pushback RFP @regression @set2', async ({ page }) => {
  const session = prepareSession({ force: false });
  Object.assign(testData, session);
  console.log(`[data] Reusing session → nameRequired: ${session.nameRequired}`);

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

  const statusRequested = page.locator(
    '//div[normalize-space()="Status"]/following-sibling::div//span[normalize-space()="Requested"]'
  );
await expect(statusRequested).toBeVisible();

const draftIcon = page.locator('//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]');
await expect(draftIcon).not.toBeVisible;
await expect(draftIcon).toHaveCount(0);

const specificationsTab = page.locator('[data-cy="hub-tab-specifications"]');
await expect(specificationsTab).toBeEnabled();
await specificationsTab.click();
 
const expandAllButton = page.getByRole('button', { name: 'Expand All', exact: true });
await expect(expandAllButton).toBeVisible();

const pushBackButton = page.getByRole('button', { name: 'Push Back', exact: true });
await expect(pushBackButton).toBeEnabled();
await pushBackButton.click();

const pushbackHeading = page.locator('h3').filter({ hasText: 'Pushback' }).first();
await expect(pushbackHeading).toBeVisible();
 
const noteTextarea = page.locator('textarea[name="noteBody"]');
await expect(noteTextarea).toBeVisible();
await expect(noteTextarea).toBeEnabled();
await noteTextarea.click();
await noteTextarea.fill(testData.description);

const pushBackCodeInput = page.locator('input[name="pushBackCode"][type="text"]');
await expect(pushBackCodeInput).toBeVisible();
await expect(pushBackCodeInput).toBeEnabled();
await pushBackCodeInput.click();

const incorrectInfoListItem = page.locator('li[data-label="Incorrect Information"]');
  await expect(incorrectInfoListItem).toBeVisible();
  await expect(incorrectInfoListItem).toBeEnabled();
  await incorrectInfoListItem.click();

  const requestInfoButton = page.getByRole('button', { name: 'Request Information', exact: true });
  await expect(requestInfoButton).toBeEnabled();
  await requestInfoButton.click();
 
  const pushBackSubmittedMsg = page.locator('p').filter({ hasText: 'Push back submitted successfully.' }).first();
  await expect(pushBackSubmittedMsg).toBeVisible();
 
  const statusRequested_draft = page.locator(
    '//div[normalize-space()="Status"]/following-sibling::div//span[normalize-space()="Draft"]'
  );
await expect(statusRequested_draft).toBeVisible();

  const draftIcon_after_pushback = page.locator('//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]');
await expect(draftIcon_after_pushback).toBeVisible();
await expect(draftIcon_after_pushback).toHaveCount(1);
 
  const cancelRequestButton = page.getByRole('button', { name: 'Cancel Request', exact: true });
  await expect(cancelRequestButton).toBeEnabled();
  await cancelRequestButton.click();
 
  const cancelledDiv = page.locator('div').filter({ hasText: '01 CANCELLED' }).first();
  await expect(cancelledDiv).toBeVisible();
 
  const statusCancelledDiv = page.locator('div').filter({ hasText: 'Status Cancelled' }).first();
  await expect(statusCancelledDiv).toBeVisible();
});
 