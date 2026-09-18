// Create Opportunity from CX Support Dashboard and find it on the dashboard
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create Opportunity from CX Support @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);

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

  const customerSidebarButton = page.locator('(//button[normalize-space()="Customer"])[1]');
  await expect(customerSidebarButton).toBeVisible();
  await customerSidebarButton.click();

  const cxSupportDashboardLink = page.getByRole('link', { name: 'CX Support Dashboard', exact: true });
  await expect(cxSupportDashboardLink).toBeVisible();
  await expect(cxSupportDashboardLink).toBeEnabled();
  await cxSupportDashboardLink.click();
  await page.waitForLoadState('domcontentloaded');

  const dashboardHeading = page.locator('label').filter({ hasText: 'CX Support Dashboard' }).first();
  await expect(dashboardHeading).toBeVisible();

  const newOpportunityButton = page.getByRole('button', { name: 'New Opportunity', exact: true });
  await expect(newOpportunityButton).toBeEnabled();
  await newOpportunityButton.click();

  const nameRequiredInput = page.locator('input[name="project.name"][type="text"]');
  await expect(nameRequiredInput).toBeVisible();
  await expect(nameRequiredInput).toBeEditable();
  await nameRequiredInput.fill(session.opportunityName);

  const descriptionTextarea = page.locator('textarea[name="project.description"]');
  await expect(descriptionTextarea).toBeVisible();
  await expect(descriptionTextarea).toBeEditable();
  await descriptionTextarea.fill(session.description);

  const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();
  await page.waitForTimeout(2000);

  const recordsCount = page.locator('//p[contains(normalize-space(),"Showing") and contains(normalize-space(),"records")]/span[2]').last();
  await expect(recordsCount).toBeVisible();
  const activeOnCount = Number((await recordsCount.innerText()).trim());

  const customerOnlyToggle = page.locator('//span[normalize-space()="Customer Only"]//..//button');
  const activeOnlyToggle = page.locator('//span[normalize-space()="Active Only"]//..//button');
  const leadOnlyToggle = page.locator('//span[normalize-space()="Lead Only"]//..//button');

  await activeOnlyToggle.click();
  await page.waitForTimeout(2000);
  expect(Number((await recordsCount.innerText()).trim())).toBeGreaterThan(activeOnCount);
  await activeOnlyToggle.click();
  await page.waitForTimeout(2000);

  const othersOffCount = Number((await recordsCount.innerText()).trim());

  await customerOnlyToggle.click();
  await page.waitForTimeout(2000);
  expect(othersOffCount).toBeGreaterThan(Number((await recordsCount.innerText()).trim()));
  await customerOnlyToggle.click();
  await page.waitForTimeout(2000);

  await leadOnlyToggle.click();
  await page.waitForTimeout(2000);
  expect(othersOffCount).toBeGreaterThan(Number((await recordsCount.innerText()).trim()));
  await leadOnlyToggle.click();
  await page.waitForTimeout(2000);

  const quickSearchInput = page.locator("//span[normalize-space()='Customer Only']/ancestor::div[3]//input[@placeholder='Quick Search']");
  await page.waitForLoadState('domcontentloaded');
  await quickSearchInput.fill(testData.quickSearch);

  const customerRowCell = page.locator('td').filter({ hasText: 'Charles Lecrec' }).first();
  await expect(customerRowCell).toBeVisible();
  await expect(customerRowCell).toBeEnabled();
  await page.waitForTimeout(4000);
  await customerRowCell.click();

  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();

  const continueCustomerPickerButton = page.getByRole('button', { name: 'Continue', exact: true }).first();
  await expect(continueCustomerPickerButton).toBeEnabled();
  await continueCustomerPickerButton.click();

  const selectedCustomerButton = page.getByRole('button', { name: 'Charles Lecrec', exact: true });
  await expect(selectedCustomerButton).toBeVisible();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  const yesAddRecordButton = page.getByRole('button', { name: 'Yes, add record', exact: true });
  await expect(yesAddRecordButton).toBeEnabled();
  await yesAddRecordButton.click();

  await page.waitForLoadState('domcontentloaded');

  const opportunityInfoPanel = page.locator('div').filter({ hasText: /OPP\d+ - Opportunity/ }).first();
  await expect(opportunityInfoPanel).toBeVisible();
  const opportunityNumber = ((await opportunityInfoPanel.textContent() || '').match(/(OPP\d+)\s*- Opportunity/) || [])[1] || '';
  expect(opportunityNumber.length).toBeGreaterThan(0);

  await expect(customerSidebarButton).toBeEnabled();
  await customerSidebarButton.click();

  await expect(cxSupportDashboardLink).toBeVisible();
  await expect(cxSupportDashboardLink).toBeEnabled();
  await cxSupportDashboardLink.click();
  await page.waitForLoadState('domcontentloaded');

  const dashboardQuickSearchInput = page.locator('[data-cy="input"]');
  await expect(dashboardQuickSearchInput).toBeVisible();
  await expect(dashboardQuickSearchInput).toBeEnabled();
  await dashboardQuickSearchInput.click();
  await dashboardQuickSearchInput.fill(session.opportunityName);
  await page.waitForTimeout(3000);

  await expect(page.getByText(session.opportunityName, { exact: true }).first()).toBeVisible();
});
