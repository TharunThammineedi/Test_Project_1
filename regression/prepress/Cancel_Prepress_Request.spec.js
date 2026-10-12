// TC12 — Cancel a Prepress Request from the Queue show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Cancelation of Prepress Request @regression', async ({ page }) => {
  test.setTimeout(720000);
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
  await page.waitForLoadState('domcontentloaded');

  const prepressButton = page.locator('(//button[normalize-space()="Prepress"])[1]');
  await expect(prepressButton).toBeVisible();
  await prepressButton.click();

  const prepressQueueLink = page.getByRole('link', { name: 'Prepress Queue', exact: true });
  await expect(prepressQueueLink).toBeEnabled();
  await prepressQueueLink.click();
  await page.waitForLoadState('domcontentloaded');

  const prepressQueueLabel = page.locator('label').filter({ hasText: 'Prepress Queue' }).first();
  await expect(prepressQueueLabel).toBeVisible();

  const firstPrepressRequest = page.locator('tbody tr').first().locator('td').nth(1);
  await expect(firstPrepressRequest).toBeVisible();
  const firstPrepressRequestText = ((await firstPrepressRequest.innerText()) || '').trim();
  console.log(`[data] First Prepress Request Id: ${firstPrepressRequestText}`);
  expect(firstPrepressRequestText).toMatch(/^PPR\d+/);
  await firstPrepressRequest.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const requestElement = page.locator(
    "//span[contains(@class,'title') and contains(normalize-space(),'Request #')]"
  );
  await expect(requestElement).toBeVisible();
  const requestId = ((await requestElement.innerText()) || '').replace('Request #', '').trim();
  console.log(`[data] Request Id: ${requestId}`);
  expect(requestId).toBe(firstPrepressRequestText);

  const productRoutesHeading = page.locator('h3').filter({ hasText: 'Product Routes / Art Sets' }).first();
  await expect(productRoutesHeading).toBeVisible();

  const detailsTab = page.locator('[data-cy="hub-tab-details"]');
  await expect(detailsTab).toBeVisible();

  const notationsTab = page.locator('[data-cy="hub-tab-notations"]');
  await expect(notationsTab).toBeVisible();

  const cancelRequestButton = page.getByRole('button', { name: 'Cancel Request', exact: true });
  await expect(cancelRequestButton).toBeVisible();
  await expect(cancelRequestButton).toBeEnabled();
  await cancelRequestButton.click();
  await page.waitForTimeout(3000);

  const cancelledListItem = page.locator('span').filter({ hasText: 'CANCELLED' }).first();
  await expect(cancelledListItem).toBeVisible();

  const cancelledBadge = page.locator('//li[@id="selected-Cancelled"]');
  await expect(cancelledBadge).toBeVisible();

  const cancelStatus = page.locator(
    '//span[contains(@class,"title") and contains(normalize-space(),"Request #")]//..//..//span[@id="badge-Cancelled"]'
  );
  await expect(cancelStatus).toBeVisible();

  const requestButton = page.locator("//button[.//p[normalize-space()='Request'] and not(@disabled)]");
  await expect(requestButton).not.toBeVisible();

  const cancelRequestButtonEnabled = page.locator(
    "//button[.//p[normalize-space()='Cancel Request'] and not(@disabled)]"
  );
  await expect(cancelRequestButtonEnabled).not.toBeVisible();
});
