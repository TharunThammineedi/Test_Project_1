// Push back a Needs Approval estimate to Draft
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Pushback Estimate @regression @set1', async ({ page }) => {
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
  await valueSelect.selectOption('Draft');

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();
  await page.waitForTimeout(3000);

  const column10 = page.locator('//thead/tr/th[10]//following::tbody/tr/td[10]/div//span');
  const column10Text = await column10.allTextContents();
  for (const text of column10Text) {
    expect(text.trim()).toBe('Draft');
  }

  const secondEstimateLink = page.locator('//tbody//tr[2]//td[2]');
  await expect(secondEstimateLink).toBeVisible();
  await expect(secondEstimateLink).toBeEnabled();
  await secondEstimateLink.click();
  await page.waitForTimeout(2000);

  const estimateText = await page.locator('//div[@class="section"]//h1//span').innerText();
  const estimateNumber = estimateText.replace(/\s*-\s*Estimate\s*$/, '').trim();
  console.log(`[data] estimateNumber: ${estimateNumber}`);

  const statusDraftDiv = page.locator('div').filter({ hasText: 'Draft' }).first();
  await expect(statusDraftDiv).toBeVisible();

  const pushBackButton = page.getByRole('button', { name: 'Push Back', exact: true });
  await expect(pushBackButton).toBeEnabled();
  await pushBackButton.click();

  const pushbackHeading = page.locator('h3').filter({ hasText: 'Pushback' }).first();
  await expect(pushbackHeading).toBeVisible();

  const noteTextarea = page.locator('textarea[name="noteBody"]');
  await expect(noteTextarea).toBeVisible();
  await expect(noteTextarea).toBeEnabled();
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

  const statusDraft = page.locator(
    '//div[normalize-space()="Status"]/following-sibling::div//span[normalize-space()="Draft"]'
  );
  await expect(statusDraft).toBeVisible();

  const draftIconAfterPushback = page.locator(
    '//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]'
  );
  await expect(draftIconAfterPushback).toBeVisible();
  await expect(draftIconAfterPushback).toHaveCount(1);

  await expect(estimateMenuLink).toBeVisible();
  await estimateMenuLink.click();
  await expect(estimatesQuotesLink).toBeVisible();
  await expect(estimatesQuotesLink).toBeEnabled();
  await estimatesQuotesLink.click();

  await page.waitForLoadState('domcontentloaded');
  await expect(newEstimateLink).toBeVisible();

  const resetButton = page.getByRole('button', { name: 'Reset', exact: true }).first();
  await expect(resetButton).toBeEnabled();
  await resetButton.click();
  await page.waitForTimeout(2000);

  const quickSearchInput = page.locator('input[placeholder="Quick Search"]').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEnabled();
  await quickSearchInput.fill(estimateNumber);
  await page.waitForTimeout(3000);

  const column10After = page.locator('//thead/tr/th[10]//following::tbody/tr/td[10]/div//span');
  await expect(column10After).toHaveCount(1);
  await expect(column10After).toHaveText('Draft');

  const searchedEstimateCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(searchedEstimateCell).toBeVisible();
  await searchedEstimateCell.click();
  await page.waitForTimeout(2000);

  // Resolve Pushback

  const estimateTextAfterOpen = await page.locator('//div[@class="section"]//h1//span').innerText();
  const estimateNumberAfterOpen = estimateTextAfterOpen.replace(/\s*-\s*Estimate\s*$/, '').trim();
  await expect(estimateNumberAfterOpen).toBe(estimateNumber);

  const resolvePushBackButton = page.locator('//p[normalize-space()="Resolve Push Back"]');
  await expect(resolvePushBackButton).toBeVisible();
  await resolvePushBackButton.click();

  const resolvePushbackHeading = page.locator('//h3[normalize-space()="Resolve Pushback"]');
  await expect(resolvePushbackHeading).toBeVisible();

  const resolveNoteTextarea = page.locator('textarea[name="resolveNoteBody"]');
  await expect(resolveNoteTextarea).toBeVisible();
  await expect(resolveNoteTextarea).toBeEditable();
  await resolveNoteTextarea.fill(testData.description);

  const submitResolveButton = page.locator('button[wire\\:click="submitResolve"]');
  await expect(submitResolveButton).toBeEnabled();
  await submitResolveButton.click();

  const pushBackResolvedMsg = page.locator('p').filter({ hasText: 'Push back resolved successfully.' }).first();
  await expect(pushBackResolvedMsg).toBeVisible();

  await expect(pushBackButton).toBeVisible();
});
