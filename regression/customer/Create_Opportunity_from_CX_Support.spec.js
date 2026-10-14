// Create Opportunity from CX Support Dashboard; preview edit-back; find on dashboard
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test.describe('CX Support Opportunity Creation @regression', () => {
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

  test('Create Opportunity from CX Support @regression @set1', async () => {
    test.setTimeout(720000);
    const session = prepareSession({ force: true });
    Object.assign(testData, session);

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

    const defaultFiltersButton = page.getByRole('button', { name: 'Filters 1', exact: true });
    await expect(defaultFiltersButton).toBeVisible();
    await expect(defaultFiltersButton).toBeEnabled();
    await defaultFiltersButton.click();

    const resetFiltersButton = page.locator('button[wire\\:click="resetRows"]').first();
    await expect(resetFiltersButton).toBeVisible();
    await expect(resetFiltersButton).toBeEnabled();
    await resetFiltersButton.click();
    await page.waitForTimeout(2000);

    const filtersButtonAfterReset = page.getByRole('button', { name: 'Filters 0', exact: true });
    await expect(filtersButtonAfterReset).toBeVisible();
    await expect(filtersButtonAfterReset).toBeEnabled();
    await filtersButtonAfterReset.click();

    const filterColumnInput = page.locator('input[name="rows.0.column"][type="text"]').first();
    await expect(filterColumnInput).toBeVisible();
    await expect(filterColumnInput).toBeEnabled();
    await filterColumnInput.click();
    const opportunityManagerOption = page.locator('li[data-label="Opportunity Manager"]').first();
    await expect(opportunityManagerOption).toBeVisible();
    await opportunityManagerOption.click();

    const filterOperatorInput = page.locator('input[name="rows.0.operator"][type="text"]').first();
    await expect(filterOperatorInput).toBeVisible();
    await expect(filterOperatorInput).toBeEnabled();
    await filterOperatorInput.click();
    const isOption = page.locator('li[data-label="is"]').first();
    await expect(isOption).toBeVisible();
    await isOption.click();

    const filterValueInput = page.locator('input[name="rows.0.value"][type="text"]').first();
    await expect(filterValueInput).toBeVisible();
    await expect(filterValueInput).toBeEnabled();
    await filterValueInput.click();
    const opportunityManagerValueOption = page.locator(`li[data-label="${testData.userPicker}"]`).first();
    await expect(opportunityManagerValueOption).toBeVisible();
    await opportunityManagerValueOption.click();

    const applyFilterButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
    await expect(applyFilterButton).toBeEnabled();
    await applyFilterButton.click();
    await page.waitForTimeout(2000);

    await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

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

    const customerRowCell = page.locator('td').filter({ hasText: testData.quickSearch }).first();
    await expect(customerRowCell).toBeVisible();
    await expect(customerRowCell).toBeEnabled();
    await page.waitForTimeout(4000);
    await customerRowCell.click();

    const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
    await expect(unlinkButton).toBeVisible();

    const continueCustomerPickerButton = page.getByRole('button', { name: 'Continue', exact: true }).first();
    await expect(continueCustomerPickerButton).toBeEnabled();
    await continueCustomerPickerButton.click();

    const selectedCustomerButton = page.getByRole('button', { name: testData.customerName, exact: true });
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
    console.log(`[data] opportunityNumber: ${opportunityNumber}`);

    await expect(customerSidebarButton).toBeEnabled();
    await customerSidebarButton.click();

    await expect(cxSupportDashboardLink).toBeVisible();
    await expect(cxSupportDashboardLink).toBeEnabled();
    await cxSupportDashboardLink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(defaultFiltersButton).toBeEnabled();
    await defaultFiltersButton.click();
    await expect(resetFiltersButton).toBeEnabled();
    await resetFiltersButton.click();
    await page.waitForTimeout(2000);
    await expect(filtersButtonAfterReset).toBeEnabled();
    await filtersButtonAfterReset.click();
    await filterColumnInput.click();
    await opportunityManagerOption.click();
    await filterOperatorInput.click();
    await isOption.click();
    await filterValueInput.click();
    await opportunityManagerValueOption.click();
    await expect(applyFilterButton).toBeEnabled();
    await applyFilterButton.click();
    await page.waitForTimeout(2000);

    const dashboardQuickSearchInput = page.locator('[data-cy="input"]');
    await expect(dashboardQuickSearchInput).toBeVisible();
    await expect(dashboardQuickSearchInput).toBeEnabled();
    await dashboardQuickSearchInput.click();
    await dashboardQuickSearchInput.fill(opportunityNumber);
    await page.waitForTimeout(3000);

    await expect(page.getByText(opportunityNumber, { exact: true }).first()).toBeVisible();

    const customerNameCell = page.locator("//span[normalize-space()='Customer:']/following-sibling::div//div[contains(@class,'text-ellipsis')]").first();
    const customerNameRaw = ((await customerNameCell.innerText()) || '').trim();
    const customerName = customerNameRaw.includes(' - ')
      ? customerNameRaw.split(' - ').slice(1).join(' - ').trim()
      : customerNameRaw;
    console.log(`[data] customerNameRaw: ${customerNameRaw}`);
    console.log(`[data] customerName: ${customerName}`);

    const openCustomerLink = page.locator("//span[normalize-space()='Customer:']/following-sibling::div//a[@x-tooltip='Open']");
    await expect(openCustomerLink).toBeVisible();
    await expect(openCustomerLink).toBeEnabled();
    await openCustomerLink.click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(customerName, { exact: true }).first()).toBeVisible();

    await expect(customerSidebarButton).toBeEnabled();
    await customerSidebarButton.click();
    await expect(cxSupportDashboardLink).toBeVisible();
    await expect(cxSupportDashboardLink).toBeEnabled();
    await cxSupportDashboardLink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(defaultFiltersButton).toBeEnabled();
    await defaultFiltersButton.click();
    await expect(resetFiltersButton).toBeEnabled();
    await resetFiltersButton.click();
    await page.waitForTimeout(2000);
    await expect(filtersButtonAfterReset).toBeEnabled();
    await filtersButtonAfterReset.click();
    await filterColumnInput.click();
    await opportunityManagerOption.click();
    await filterOperatorInput.click();
    await isOption.click();
    await filterValueInput.click();
    await opportunityManagerValueOption.click();
    await expect(applyFilterButton).toBeEnabled();
    await applyFilterButton.click();
    await page.waitForTimeout(2000);

    await dashboardQuickSearchInput.click();
    await dashboardQuickSearchInput.fill(opportunityNumber);
    await page.waitForTimeout(3000);
    await expect(page.getByText(opportunityNumber, { exact: true }).first()).toBeVisible();

    const openOpportunityLink = page.locator("//span[normalize-space()='Opportunity:']/following-sibling::div//a[@x-tooltip='Open']");
    await expect(openOpportunityLink).toBeVisible();
    await expect(openOpportunityLink).toBeEnabled();
    await openOpportunityLink.click();

    await page.waitForLoadState('domcontentloaded');
    const openedOpportunityPanel = page.locator('div').filter({ hasText: new RegExp(`${opportunityNumber}\\s*- Opportunity`) }).first();
    await expect(openedOpportunityPanel).toBeVisible();

    await expect(customerSidebarButton).toBeEnabled();
    await customerSidebarButton.click();
    await expect(cxSupportDashboardLink).toBeVisible();
    await expect(cxSupportDashboardLink).toBeEnabled();
    await cxSupportDashboardLink.click();
    await page.waitForLoadState('domcontentloaded');

    await dashboardQuickSearchInput.click();
    await dashboardQuickSearchInput.fill('@@@INVALID###!!!');
    await page.waitForTimeout(3000);

    const noResultsMessage = page.getByText('No items matched the given criteria').first();
    await expect(noResultsMessage).toBeVisible();
  });

  test('Edit Opportunity from Preview on CX Support @regression @set1', async () => {
    test.setTimeout(720000);
    const session = prepareSession({ force: true });
    Object.assign(testData, session);
    console.log(`[data] opportunityName: ${session.opportunityName}`);
    console.log(`[data] description: ${session.description}`);

    const customerSidebarButton = page.locator('(//button[normalize-space()="Customer"])[1]');
    await expect(customerSidebarButton).toBeVisible();
    await customerSidebarButton.click();

    const cxSupportDashboardLink = page.getByRole('link', { name: 'CX Support Dashboard', exact: true });
    await expect(cxSupportDashboardLink).toBeVisible();
    await expect(cxSupportDashboardLink).toBeEnabled();
    await cxSupportDashboardLink.click();
    await page.waitForLoadState('domcontentloaded');

    const defaultFiltersButton = page.getByRole('button', { name: 'Filters 1', exact: true });
    await expect(defaultFiltersButton).toBeVisible();
    await expect(defaultFiltersButton).toBeEnabled();
    await defaultFiltersButton.click();

    const resetFiltersButton = page.locator('button[wire\\:click="resetRows"]').first();
    await expect(resetFiltersButton).toBeVisible();
    await expect(resetFiltersButton).toBeEnabled();
    await resetFiltersButton.click();
    await page.waitForTimeout(2000);

    const filtersButtonAfterReset = page.getByRole('button', { name: 'Filters 0', exact: true });
    await expect(filtersButtonAfterReset).toBeVisible();
    await expect(filtersButtonAfterReset).toBeEnabled();
    await filtersButtonAfterReset.click();

    const filterColumnInput = page.locator('input[name="rows.0.column"][type="text"]').first();
    await expect(filterColumnInput).toBeVisible();
    await expect(filterColumnInput).toBeEnabled();
    await filterColumnInput.click();
    const opportunityManagerOption = page.locator('li[data-label="Opportunity Manager"]').first();
    await expect(opportunityManagerOption).toBeVisible();
    await opportunityManagerOption.click();

    const filterOperatorInput = page.locator('input[name="rows.0.operator"][type="text"]').first();
    await expect(filterOperatorInput).toBeVisible();
    await expect(filterOperatorInput).toBeEnabled();
    await filterOperatorInput.click();
    const isOption = page.locator('li[data-label="is"]').first();
    await expect(isOption).toBeVisible();
    await isOption.click();

    const filterValueInput = page.locator('input[name="rows.0.value"][type="text"]').first();
    await expect(filterValueInput).toBeVisible();
    await expect(filterValueInput).toBeEnabled();
    await filterValueInput.click();
    const opportunityManagerValueOption = page.locator(`li[data-label="${testData.userPicker}"]`).first();
    await expect(opportunityManagerValueOption).toBeVisible();
    await opportunityManagerValueOption.click();

    const applyFilterButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
    await expect(applyFilterButton).toBeEnabled();
    await applyFilterButton.click();
    await page.waitForTimeout(2000);

    await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

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

    const quickSearchInput = page.locator("//span[normalize-space()='Customer Only']/ancestor::div[3]//input[@placeholder='Quick Search']");
    await page.waitForLoadState('domcontentloaded');
    await quickSearchInput.fill(testData.quickSearch);

    const customerRowCell = page.locator('td').filter({ hasText: testData.quickSearch }).first();
    await expect(customerRowCell).toBeVisible();
    await expect(customerRowCell).toBeEnabled();
    await page.waitForTimeout(4000);
    await customerRowCell.click();

    const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
    await expect(unlinkButton).toBeVisible();

    const continueCustomerPickerButton = page.getByRole('button', { name: 'Continue', exact: true }).first();
    await expect(continueCustomerPickerButton).toBeEnabled();
    await continueCustomerPickerButton.click();

    const selectedCustomerButton = page.getByRole('button', { name: testData.customerName, exact: true });
    await expect(selectedCustomerButton).toBeVisible();

    const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    const yesAddRecordButton = page.getByRole('button', { name: 'Yes, add record', exact: true });
    await expect(yesAddRecordButton).toBeVisible();
    await expect(page.getByText(session.opportunityName, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(session.description, { exact: true }).first()).toBeVisible();

    const noINeedToEditButton = page.locator("//p[normalize-space()='No, I need to edit']/parent::button");
    await expect(noINeedToEditButton).toBeVisible();
    await expect(noINeedToEditButton).toBeEnabled();
    await noINeedToEditButton.click();

    await expect(nameRequiredInput).toHaveValue(session.opportunityName);
    await expect(descriptionTextarea).toHaveValue(session.description);
    await expect(selectedCustomerButton).toBeVisible();

    const editedName = `${session.opportunityName} edited`;
    const editedDescription = `${session.description} edited`;
    await nameRequiredInput.fill(editedName);
    await descriptionTextarea.fill(editedDescription);
    console.log(`[data] editedName: ${editedName}`);
    console.log(`[data] editedDescription: ${editedDescription}`);

    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(yesAddRecordButton).toBeVisible();
    await expect(page.getByText(editedName, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(editedDescription, { exact: true }).first()).toBeVisible();

    await expect(yesAddRecordButton).toBeEnabled();
    await yesAddRecordButton.click();

    await page.waitForLoadState('domcontentloaded');
    const opportunityInfoPanel = page.locator('div').filter({ hasText: /OPP\d+ - Opportunity/ }).first();
    await expect(opportunityInfoPanel).toBeVisible();
    const opportunityNumber = ((await opportunityInfoPanel.textContent() || '').match(/(OPP\d+)\s*- Opportunity/) || [])[1] || '';
    console.log(`[data] editedOpportunityNumber: ${opportunityNumber}`);
    expect(opportunityNumber.length).toBeGreaterThan(0);
  });
});
