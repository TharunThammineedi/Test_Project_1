// Product Routes: headers, link routes, and quick search
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Link Product Routes and quick search @regression @set1', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

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
  await valueSelect_2.selectOption("requested");

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 2', exact: true })).toBeVisible();

  const unassignedToggle = page.locator('//span[normalize-space()="Unassigned"]/..//div/button').first();
  await expect(unassignedToggle).toBeVisible();
  await expect(unassignedToggle).toBeEnabled();
  const isOff = await unassignedToggle.evaluate(el => el.classList.contains('bg-gray-200'));
  if (isOff) {
    await unassignedToggle.click();
  }
  await expect(unassignedToggle).toHaveClass(/bg-denim-blue-600/);

  const column10 = page.locator('//thead/tr/th[10]//following::tbody/tr/td[10]/div//span');
  const column10Text = await column10.allTextContents();
  for (const text of column10Text) {
    expect(text.trim()).toBe("Requested");
  }

  const column11 = page.locator('//thead/tr/th[11]//following::tbody/tr/td[11]/div');
  const column11Text = await column11.allTextContents();
  for (const text of column11Text) {
    expect(text.trim()).toBe(loggedInUserName);
  }

  const firstRfpCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstRfpCell).toBeVisible();
  const rfpNumber = (await firstRfpCell.innerText()).trim();
  await firstRfpCell.click();
  await page.waitForTimeout(2000);

  const proposalTitleSpan = page.locator('span').filter({ hasText: `${rfpNumber} - Request for Proposal` }).first();
  await expect(proposalTitleSpan).toBeVisible();

  const statusRequestedText = page.locator('div').filter({ hasText: 'Status Requested' }).first();
  await expect(statusRequestedText).toBeVisible();

  const linksTabButton = page.locator('[data-cy="hub-tab-links"]');
  await expect(linksTabButton).toBeVisible();
  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();

  const productRoutesHeading = page.locator('h3').filter({ hasText: 'Product Routes'}).first();
  await expect(productRoutesHeading).toBeVisible();

  await expect(page.locator('th').filter({ hasText: 'CODE | ROUTE' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'CUSTOMER PART NUMBER' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'PRODUCT CLASS'}).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'PRODUCT SUMMARY' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'DESCRIPTION' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'ART SET STATUS' }).first()).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'LATEST PREPRESS REQUEST' }).first()).toBeVisible();
  await page.waitForTimeout(2000);

  const productRouteRows = page.locator('//h3[normalize-space()="Product Routes"]//following::table//thead/following-sibling::tbody/tr');
  const rowCountBefore = await productRouteRows.count();
  console.log("Row count:", rowCountBefore);

  const linkRoutesButton = page.getByRole('button', { name: 'Link Routes', exact: true });
  await expect(linkRoutesButton).toBeEnabled();
  await linkRoutesButton.click();

  const chooseProductRoutesHeading = page.locator('h3').filter({ hasText: 'Choose Product Routes' }).first();
  await expect(chooseProductRoutesHeading).toBeVisible();

  const codedRows = page.locator("//input[contains(@class,'form-checkbox') and starts-with(@id,'checkbox.input')]/ancestor::tr[string-length(normalize-space(td[2])) > 0]");
  await expect(codedRows.first()).toBeVisible();

  const row1 = codedRows.nth(0);
  const checkbox1 = row1.locator('input.form-checkbox[id^="checkbox.input"]');
  await expect(checkbox1).toBeVisible();
  await checkbox1.click();
  await expect(checkbox1).toBeChecked();

  const expectedText_1 = (await row1.locator('xpath=./td[2]').innerText()).trim().split(/\n/)[0].split('|')[0].trim();
  console.log("checkbox1Text:", expectedText_1);

  await expect(page.getByRole('button', { name: 'Updating selection...' })).toHaveCount(0);

  const row2 = codedRows.nth(1);
  const checkbox2 = row2.locator('input.form-checkbox[id^="checkbox.input"]');
  await expect(checkbox2).toBeVisible();
  await checkbox2.click();
  await expect(checkbox2).toBeChecked();

  const expectedText_2 = (await row2.locator('xpath=./td[2]').innerText()).trim().split(/\n/)[0].split('|')[0].trim();
  console.log("checkbox2Text:", expectedText_2);
  await page.waitForTimeout(2000);
  await expect(page.getByRole('button', { name: 'Updating selection...' })).toHaveCount(0);
  const continueButton = page.locator('//h3[normalize-space()="Choose Product Routes"]/following::button[normalize-space()="Continue"]').first();
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page.locator('p').filter({ hasText: 'Routes linked.' }).first()).toBeVisible();

  const viewAllButton = page.locator('//button[contains(normalize-space(),"View All")]');
  const viewLessButton = page.locator('//button[contains(normalize-space(),"View Less")]');
  if (await viewAllButton.isVisible()) {
    await viewAllButton.click();
    await expect(viewLessButton).toBeVisible();
  }
  await page.waitForTimeout(2000);
  await expect(page.locator('td').filter({ hasText: expectedText_1 }).first()).toBeVisible();
  await expect(page.locator('td').filter({ hasText: expectedText_2 }).first()).toBeVisible();

  const rowCountAfterLink = await productRouteRows.count();
  console.log("Row count after link:", rowCountAfterLink);
  expect(rowCountAfterLink).toBeGreaterThanOrEqual(rowCountBefore);

  const quickSearchInput = page.locator('[data-cy="search-alt"] input[data-cy="input"][placeholder="Quick Search"]').last();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();
  await quickSearchInput.fill(expectedText_1);
  await expect(page.locator('td').filter({ hasText: expectedText_1 }).first()).toBeVisible();
  await expect(productRouteRows).toHaveCount(1);

  await quickSearchInput.clear();
  await page.waitForTimeout(2000);
  await expect(productRouteRows).toHaveCount(rowCountAfterLink);
});
