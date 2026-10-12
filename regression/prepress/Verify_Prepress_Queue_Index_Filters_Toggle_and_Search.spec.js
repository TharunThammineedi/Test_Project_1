// TC001–006 — Prepress Queue index: navigate, Mine / Unassigned / Active Only toggles, pagination, quick search
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

async function isToggleOn(toggle) {
  return toggle.evaluate((button) => button.classList.contains('bg-denim-blue-600'));
}

async function setToggle(toggle, wantOn) {
  const on = await isToggleOn(toggle);
  if (on !== wantOn) {
    await toggle.click();
    await toggle.page().waitForTimeout(2000);
  }
  expect(await isToggleOn(toggle)).toBe(wantOn);
}

test('Verify Prepress Queue Index Filters, Toggle and Search @regression', async ({ page }) => {
  test.setTimeout(360000);
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

  // --- TC001: Navigate to Prepress Queue ---
  const prepressButton = page.locator('(//button[normalize-space()="Prepress"])[1]');
  await expect(prepressButton).toBeVisible();
  await prepressButton.click();

  const prepressQueueLink = page.getByRole('link', { name: 'Prepress Queue', exact: true });
  await expect(prepressQueueLink).toBeEnabled();
  await prepressQueueLink.click();
  await page.waitForLoadState('domcontentloaded');

  const prepressQueueLabel = page.locator('label').filter({ hasText: 'Prepress Queue' }).first();
  await expect(prepressQueueLabel).toBeVisible();

  const newPrepressRequestLink = page.getByRole('link', { name: 'New Prepress Request', exact: true });
  await expect(newPrepressRequestLink).toBeVisible();
  await expect(newPrepressRequestLink).toBeEnabled();

  await expect(page.locator('th').filter({ hasText: 'REQUEST #' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'CUSTOMER NAME | CUSTOMER TIER' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'PRODUCT ROUTES ON REQUEST' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'ASSIGNED TO' }).first()).toBeVisible();

  const recordsCount = page.locator(
    '//p[contains(normalize-space(),"Showing") and contains(normalize-space(),"records")]/span[2]'
  );
  await expect(recordsCount).toBeVisible();
  const baselineTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] baselineTotal: ${baselineTotal}`);
  expect(baselineTotal).toBeGreaterThan(0);
  await expect(page.locator('tbody tr').first()).toBeVisible();

  const resetButton = page.getByRole('button', { name: 'Reset', exact: true }).first();
  await expect(resetButton).toBeVisible();

  const saveSearchButton = page.getByRole('button', { name: 'Save Search', exact: true });
  await expect(saveSearchButton).toBeVisible();

  const quickSearchInput = page.getByPlaceholder('Quick Search').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();

  const filtersButton = page.getByRole('button', { name: /Filters \d+/, exact: true });
  await expect(filtersButton).toBeVisible();

  const mineToggle = page.locator('//span[normalize-space()="Mine"]/following-sibling::div/button').first();
  const unassignedToggle = page.locator('//span[normalize-space()="Unassigned"]/..//div/button').first();
  const activeOnlyToggle = page.locator('//span[normalize-space()="Active Only"]//following::button[1]');

  await expect(mineToggle).toBeVisible();
  await expect(unassignedToggle).toBeVisible();
  await expect(activeOnlyToggle).toBeVisible();

  // Default index often has Unassigned + Active Only on
  await setToggle(activeOnlyToggle, true);
  await setToggle(unassignedToggle, true);
  await setToggle(mineToggle, false);
  await page.waitForTimeout(2000);

  // --- Pagination (same controls as Estimate / Customer index) ---
  const currentPage = page.locator('//span[@class="pagination-item"]//span[@aria-current="page"]');
  await expect(currentPage).toHaveText('1');

  const firstRequestOnPage = page.locator('tbody tr').first().locator('td').nth(1);
  await expect(firstRequestOnPage).toBeVisible();
  const page1FirstRequest = ((await firstRequestOnPage.innerText()) || '').trim();
  console.log(`[data] page1FirstRequest: ${page1FirstRequest}`);

  const page2Button = page.locator('button[aria-label="Go to page 2"]');
  const paginatedTotal = Number((await recordsCount.innerText()).trim());
  if (paginatedTotal > 10 && (await page2Button.isVisible().catch(() => false))) {
    await expect(page2Button).toBeEnabled();
    await page2Button.click();
    await page.waitForTimeout(2000);
    await expect(currentPage).toHaveText('2');

    const page2FirstRequest = ((await firstRequestOnPage.innerText()) || '').trim();
    console.log(`[data] page2FirstRequest: ${page2FirstRequest}`);
    expect(page2FirstRequest).not.toBe(page1FirstRequest);

    const nextPaginationButton = page.locator('button[aria-label="Next"]');
    await expect(nextPaginationButton).toBeEnabled();
    await nextPaginationButton.click();
    await page.waitForTimeout(2000);
    await expect(currentPage).not.toHaveText('2');

    const lastPageButton = page.locator('//span[@class="pagination-item"]//button').last();
    await expect(lastPageButton).toBeEnabled();
    const lastPageLabel = (await lastPageButton.getAttribute('aria-label')) || '';
    const lastPageNumber = (lastPageLabel.match(/(\d+)/) || [])[1];
    await lastPageButton.click();
    await page.waitForTimeout(2000);
    if (lastPageNumber) {
      await expect(currentPage).toHaveText(lastPageNumber);
    }

    const previousPaginationButton = page.locator('button[aria-label="Previous"]');
    await expect(previousPaginationButton).toBeEnabled();
    await previousPaginationButton.click();
    await page.waitForTimeout(2000);
    if (lastPageNumber) {
      await expect(currentPage).not.toHaveText(lastPageNumber);
    }

    // Back to page 1 for filter / search asserts
    const page1Button = page.locator('button[aria-label="Go to page 1"]');
    if (await page1Button.isVisible().catch(() => false)) {
      await page1Button.click();
    } else {
      for (let i = 0; i < 20; i++) {
        if (((await currentPage.innerText()) || '').trim() === '1') break;
        await previousPaginationButton.click();
        await page.waitForTimeout(1500);
      }
    }
    await page.waitForTimeout(2000);
    await expect(currentPage).toHaveText('1');
  } else {
    console.log('[data] Skipping pagination — not enough records for page 2');
  }

  const tableRows = page.locator('tbody tr');
  // Assigned To is last column; "Select User" may be button / link / nested text
  const selectUserRows = page.locator('tbody tr').filter({ hasText: 'Select User' });

  async function expectAllVisibleRowsUnassigned() {
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    for (let i = 0; i < rowCount; i++) {
      const assignedText = ((await tableRows.nth(i).locator('td').last().innerText()) || '')
        .replace(/\s+/g, ' ')
        .trim();
      expect(assignedText).toContain('Select User');
    }
  }

  // --- TC004: Unassigned ON → only unassigned (Select User in Assigned To) ---
  await setToggle(unassignedToggle, true);
  await page.waitForTimeout(2000);
  const unassignedTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] unassignedOnTotal: ${unassignedTotal}`);
  if (unassignedTotal > 0) {
    await expectAllVisibleRowsUnassigned();
    await expect(selectUserRows).toHaveCount(await tableRows.count());
  }

  // --- TC004: Unassigned OFF ---
  await setToggle(unassignedToggle, false);
  await page.waitForTimeout(2000);
  const unassignedOffTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] unassignedOffTotal: ${unassignedOffTotal}`);
  expect(unassignedOffTotal).toBeGreaterThanOrEqual(unassignedTotal);

  // --- TC002: Mine ON → result set narrows; Assigned To is current user when assigned ---
  await setToggle(mineToggle, true);
  await page.waitForTimeout(2000);
  const mineOnTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] mineOnTotal: ${mineOnTotal}`);
  expect(mineOnTotal).toBeLessThan(unassignedOffTotal);
  expect(mineOnTotal).toBeGreaterThan(0);

  const mineRowCount = await tableRows.count();
  for (let i = 0; i < mineRowCount; i++) {
    const assignedText = ((await tableRows.nth(i).locator('td').last().innerText()) || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    if (!assignedText.includes('select user')) {
      expect(assignedText).toContain(testData.userPicker.toLowerCase());
    }
  }

  // --- TC004: Mine ON + Unassigned ON (intersection; may be empty) ---
  await setToggle(unassignedToggle, true);
  await page.waitForTimeout(2000);
  const mineAndUnassignedTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] mineAndUnassignedTotal: ${mineAndUnassignedTotal}`);
  expect(mineAndUnassignedTotal).toBeGreaterThanOrEqual(0);
  if (mineAndUnassignedTotal > 0) {
    await expectAllVisibleRowsUnassigned();
  }

  // --- TC003: Mine OFF ---
  await setToggle(mineToggle, false);
  await setToggle(unassignedToggle, false);
  await page.waitForTimeout(2000);
  const mineOffTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] mineOffTotal: ${mineOffTotal}`);
  expect(mineOffTotal).toBeGreaterThan(mineOnTotal);

  // --- TC005: Active Only ON / OFF ---
  await setToggle(activeOnlyToggle, true);
  await page.waitForTimeout(2000);
  const activeOnlyTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] activeOnlyTotal: ${activeOnlyTotal}`);

  await setToggle(activeOnlyToggle, false);
  await page.waitForTimeout(2000);
  const activeOnlyOffTotal = Number((await recordsCount.innerText()).trim());
  console.log(`[data] activeOnlyOffTotal: ${activeOnlyOffTotal}`);
  expect(activeOnlyOffTotal).toBeGreaterThanOrEqual(activeOnlyTotal);

  // Active Only OFF → Cancelled / Complete visible (via status text or filter search)
  const inactiveStatusCell = page
    .locator('tbody tr td')
    .filter({ hasText: /Cancelled|Complete/i })
    .first();
  if (await inactiveStatusCell.isVisible().catch(() => false)) {
    const inactiveRow = inactiveStatusCell.locator('xpath=ancestor::tr[1]');
    const inactiveRequestId = ((await inactiveRow.locator('td').nth(1).innerText()) || '').trim();
    console.log(`[data] inactiveRequestId: ${inactiveRequestId}`);
    expect(inactiveRequestId).toMatch(/^PPR\d+/);

    await quickSearchInput.fill(inactiveRequestId);
    await quickSearchInput.press('Enter');
    await page.waitForTimeout(2000);
    await expect(page.locator('tbody tr').filter({ hasText: inactiveRequestId }).first()).toBeVisible();
    await expect(page.locator('tbody tr td').filter({ hasText: /Cancelled|Complete/i }).first()).toBeVisible();
    await quickSearchInput.clear();
    await page.waitForTimeout(2000);
  } else {
    console.log('[data] No Cancelled/Complete row on first page after Active Only OFF — skipping status search assert');
  }

  await setToggle(activeOnlyToggle, true);
  await setToggle(unassignedToggle, false);
  await setToggle(mineToggle, false);
  await expect(resetButton).toBeEnabled();
  await resetButton.click();
  await page.waitForTimeout(2000);

  // --- TC006: Quick Search by Request # ---
  const firstRequestCell = page.locator('tbody tr').first().locator('td').nth(1);
  await expect(firstRequestCell).toBeVisible();
  const requestNumber = ((await firstRequestCell.innerText()) || '').trim();
  console.log(`[data] requestNumber: ${requestNumber}`);
  expect(requestNumber).toMatch(/^PPR\d+/);

  await quickSearchInput.fill(requestNumber);
  await quickSearchInput.press('Enter');
  await page.waitForTimeout(2000);

  const matchingRows = page.locator('tbody tr').filter({ hasText: requestNumber });
  await expect(matchingRows).toHaveCount(1);
  await expect(matchingRows.first().locator('td').nth(1)).toContainText(requestNumber);

  await matchingRows.first().locator('td').nth(1).click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  const requestTitle = page.locator(
    `//span[contains(@class,"title") and contains(normalize-space(.),"Request #${requestNumber}")]`
  );
  await expect(requestTitle).toBeVisible();
});
