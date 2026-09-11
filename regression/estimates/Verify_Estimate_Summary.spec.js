// Verify Summary icon on Estimate Show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Estimate Summary @regression @set1', async ({ page }) => {
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

  const estimatesQuotesLink = page.getByRole('link', { name: 'Estimates/Quotes', exact: true });
  await expect(estimatesQuotesLink).toBeVisible();
  await expect(estimatesQuotesLink).toBeEnabled();
  await estimatesQuotesLink.click();

  const firstEstimateCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstEstimateCell).toBeVisible();
  await expect(firstEstimateCell).toContainText(/EST\d+/);
  const cellText = (await firstEstimateCell.textContent()) || '';
  const estimateNumber = cellText.match(/EST\d+/)[0];
  await firstEstimateCell.click();
  await page.waitForTimeout(2000);

  const estimateHeading = page.locator('span').filter({ hasText: `${estimateNumber} - Estimate` }).first();
  await expect(estimateHeading).toBeVisible();

  const summaryButton = page.locator('[data-cy="summary-button"]');
  await expect(summaryButton).toBeEnabled();
  await page.goto(page.url().replace(/\/$/, '') + '/summary');
  await expect(page).toHaveURL(/\/summary/);

  const summaryHeading = page.locator('h1').filter({ hasText: `Estimate #${estimateNumber} Summary` }).first();
  await expect(summaryHeading).toBeVisible();
});
