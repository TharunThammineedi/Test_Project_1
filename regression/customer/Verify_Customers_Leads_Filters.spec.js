// Customer_TestCase_60 to Customer_TestCase_63 — Customers / Leads Filters
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Customers Leads Filters @regression @set1', async ({ page }) => {
  test.setTimeout(300000);
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

  const confirmSignInButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(confirmSignInButton).toBeEnabled();
  await confirmSignInButton.click();
  await page.waitForLoadState('domcontentloaded');

  const customerSidebarButton = page.locator('(//button[normalize-space()="Customer"])[1]');
  await expect(customerSidebarButton).toBeVisible();
  await customerSidebarButton.click();

  const cxSupportDashboardLink = page.getByRole('link', { name: 'Customers', exact: true });
  await expect(cxSupportDashboardLink).toBeVisible();
  await expect(cxSupportDashboardLink).toBeEnabled();
  await cxSupportDashboardLink.click();
  await page.waitForLoadState('domcontentloaded');

const customersLeadsLabel = page.locator('label').filter({ hasText: 'Customers / Leads' }).first();
await expect(customersLeadsLabel).toBeVisible();

const activeOnlyFilter = page.locator('span').filter({ hasText: 'Active Only' }).first();
await expect(activeOnlyFilter).toBeVisible();

const leadOnlyFilter = page.locator('span').filter({ hasText: 'Lead Only' }).first();
await expect(leadOnlyFilter).toBeVisible();

const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
await expect(filtersButton).toBeVisible();
 
await expect(filtersButton).toBeEnabled();
await filtersButton.click();

await page.waitForTimeout(3000);

const filtersSpan = page.locator('span').filter({ hasText: 'Filters' }).first();
await expect(filtersSpan).toBeVisible();
  
const whereLabel = page.locator('label').filter({ hasText: 'Where' }).first();
await expect(whereLabel).toBeVisible();

  const columnSelect = page.locator('select').filter({ hasText: 'Column' }).first();
  await expect(columnSelect).toBeVisible();

  const operatorSelect = page.locator('select').filter({ hasText: 'Operator' }).first();
  await expect(operatorSelect).toBeVisible();

  const valueInput = page.locator('//input[@placeholder="value"]');
  await expect(valueInput).toBeVisible();

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeVisible();

  const AddFilterButton = page.locator('//span[normalize-space()="Add a filter"]');
  await expect(AddFilterButton).toBeVisible();

   
  const columnSelect_Code = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_Code.click();
  await (columnSelect_Code).selectOption("Code");

  const operatorSelect_Code = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_Code.click();
  await (operatorSelect_Code).selectOption("is equal to");

  const valueSelect_Code = page.locator('//input[@placeholder="value"]');
  await valueSelect_Code.click();
  await valueSelect_Code.fill('CUS1000');

  // 10. Apply filter
  const applyButton_Code = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton_Code).toBeEnabled();
  await applyButton_Code.click();
  await page.waitForTimeout(3000);

const filtersButton_afterCode = page.getByRole('button', { name: 'Filters 1', exact: true });
await expect(filtersButton_afterCode).toBeVisible();

const customerRowsCode = page.locator('//tbody/tr//td[2]//div[contains(@class,"text-left")]');
await expect(customerRowsCode).toHaveCount(1);
await expect(customerRowsCode).toHaveText('CUS1000');
console.log(`[data] countOfCustomerRowsCode: 1`);


  const resetButton = page.getByRole('button', { name: 'Reset', exact: true }).last();
  await expect(resetButton).toBeVisible();
  await expect(resetButton).toBeEnabled();
  await resetButton.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterResetCode = page.getByRole('button', { name: 'Filters 0', exact: true });
await expect(filtersButton_afterResetCode).toBeVisible();
 
  const columnSelect_Name = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_Name.click();
  await (columnSelect_Name).selectOption("Customer Name | Customer Tier");

  const operatorSelect_Name = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_Name.click();
  await (operatorSelect_Name).selectOption("contains");

  const valueSelect_Name = page.locator('//input[@placeholder="value"]');
  await valueSelect_Name.click();
  await valueSelect_Name.fill(testData.customerName);

   // 10. Apply filter
   const applyButton_Name = page.getByRole('button', { name: 'Apply', exact: true });
   await expect(applyButton_Name).toBeEnabled();
   await applyButton_Name.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterName = page.getByRole('button', { name: 'Filters 1', exact: true });
  await expect(filtersButton_afterName).toBeVisible();

  const customerRows_Name = page.locator('//table/thead//th[3]//following::tbody//tr//td[3]/div');
  const customerRows_Name_Text = await customerRows_Name.allTextContents();
  for (const text of customerRows_Name_Text) {
    expect(text.trim().toLowerCase()).toContain(testData.customerName.trim().toLowerCase());
  }

  const resetButton_afterName = page.getByRole('button', { name: 'Reset', exact: true }).last();
  await expect(resetButton_afterName).toBeVisible();
  await expect(resetButton_afterName).toBeEnabled();
  await resetButton_afterName.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterResetName = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton_afterResetName).toBeVisible();

  const columnSelect_City = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_City.click();
  await (columnSelect_City).selectOption("City");

  const operatorSelect_City = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_City.click();
  await (operatorSelect_City).selectOption("contains");

  const valueSelect_City = page.locator('//input[@placeholder="value"]');
  await valueSelect_City.click();
  await valueSelect_City.fill(testData.CustomerCity);
   // 10. Apply filter
   const applyButton_City = page.getByRole('button', { name: 'Apply', exact: true });
   await expect(applyButton_City).toBeEnabled();
   await applyButton_City.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterCity = page.getByRole('button', { name: 'Filters 1', exact: true });
  await expect(filtersButton_afterCity).toBeVisible();

  const customerRows_City = page.locator('//table/thead//th[5]//following::tbody//tr//td[5]/div');
  const customerRows_City_Text = await customerRows_City.allTextContents();
  for (const text of customerRows_City_Text) {
    expect(text.trim().toLowerCase()).toContain(testData.CustomerCity.trim().toLowerCase());
  }

  const resetButton_afterCity = page.getByRole('button', { name: 'Reset', exact: true }).last();
  await expect(resetButton_afterCity).toBeVisible();
  await expect(resetButton_afterCity).toBeEnabled();
  await resetButton_afterCity.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterResetCity = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton_afterResetCity).toBeVisible();

  const columnSelect_State = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_State.click();
  await (columnSelect_State).selectOption("State");

  const operatorSelect_State = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_State.click();
  await (operatorSelect_State).selectOption("contains");

  const valueSelect_State = page.locator('//input[@placeholder="value"]');
  await valueSelect_State.click();
  await valueSelect_State.fill(testData.CustomerState);
   // 10. Apply filter
   const applyButton_State = page.getByRole('button', { name: 'Apply', exact: true });
   await expect(applyButton_State).toBeEnabled();
   await applyButton_State.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterState = page.getByRole('button', { name: 'Filters 1', exact: true });
  await expect(filtersButton_afterState).toBeVisible();

  const customerRows_State = page.locator('//table/thead//th[6]//following::tbody//tr//td[6]/div');
  const customerRows_State_Text = await customerRows_State.allTextContents();
  for (const text of customerRows_State_Text) {
    expect(text.trim().toLowerCase()).toContain(testData.CustomerState.trim().toLowerCase());
  }
  const resetButton_afterState = page.getByRole('button', { name: 'Reset', exact: true }).last();
  await expect(resetButton_afterState).toBeVisible();
  await expect(resetButton_afterState).toBeEnabled();
  await resetButton_afterState.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterResetState = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton_afterResetState).toBeVisible();

  const columnSelect_Tier = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_Tier.click();
  await (columnSelect_Tier).selectOption("Customer Tier");

  const operatorSelect_Tier = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_Tier.click();
  await (operatorSelect_Tier).selectOption("is equal to");

  const valueSelect_Tier = page.locator('//input[@placeholder="value"]');
  await valueSelect_Tier.click();
  await valueSelect_Tier.fill(testData.CustomerTier);
  
  // 10. Apply filter
  const applyButton_Tier = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton_Tier).toBeEnabled();
  await applyButton_Tier.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterTier = page.getByRole('button', { name: 'Filters 1', exact: true });
  await expect(filtersButton_afterTier).toBeVisible();

  // const customerRows_Tier = page.locator('//table/thead//th[11]//following::tbody//tr//td[11]/div');
  // const customerRows_Tier_Text = await customerRows_Tier.allTextContents();
  // for (const text of customerRows_Tier_Text) {
  //   expect(text.trim().toLowerCase()).toBe(testData.CustomerTier.trim().toLowerCase());
  // }

  const deleteButton_afterTier = page.locator('//span[normalize-space()="Filters"]//following::button[contains(@*[name()="x-on:click.stop"], "remove")]');
  await expect(deleteButton_afterTier).toBeVisible();
  await expect(deleteButton_afterTier).toBeEnabled();
  await deleteButton_afterTier.click();
  console.log("Delete button after tier clicked");
  const applyButton_AfterDeleteTier = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton_AfterDeleteTier).toBeEnabled();
  await applyButton_AfterDeleteTier.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterResetTier = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton_afterResetTier).toBeVisible();

  const columnSelect_Status = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_Status.click();
  await (columnSelect_Status).selectOption("Status");

  const operatorSelect_Status = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_Status.click();
  await (operatorSelect_Status).selectOption("is equal to");

  const valueSelect_Status = page.locator('//input[@placeholder="value"]');
  await valueSelect_Status.click();
  await valueSelect_Status.fill('Active');
  
  // 10. Apply filter
  const applyButton_Status = page.getByRole('button', { name: 'Apply', exact: true }).last();
  await expect(applyButton_Status).toBeEnabled();
  await applyButton_Status.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterStatus = page.getByRole('button', { name: 'Filters 1', exact: true });
  await expect(filtersButton_afterStatus).toBeVisible();

  const activeStatusRows_Status = page.locator('//table/thead//th[7]//following::tbody//tr//td[7]//span')
  const statusTexts_Active_Status = await activeStatusRows_Status.allTextContents();
  for (const status of statusTexts_Active_Status) {
      expect(status.trim()).toBe('Active');
  }

  const deleteButton_afterStatus = page.locator('//span[normalize-space()="Filters"]//following::button[contains(@*[name()="x-on:click.stop"], "remove")]');
  await expect(deleteButton_afterStatus).toBeVisible();
  await expect(deleteButton_afterStatus).toBeEnabled();
  await deleteButton_afterStatus.click();
  console.log("Delete button after status clicked");
  const applyButton_AfterDeleteStatus = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton_AfterDeleteStatus).toBeEnabled();
  await applyButton_AfterDeleteStatus.click();
  await page.waitForTimeout(3000);

  const filtersButton_afterResetStatus = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton_afterResetStatus).toBeVisible();

  const columnSelect_City_Multiple = page.locator("xpath=//option[normalize-space(.)='Column']/ancestor::select");
  await columnSelect_City_Multiple.click();
  await (columnSelect_City_Multiple).selectOption("City");

  const operatorSelect_City_Multiple = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect_City_Multiple.click();
  await (operatorSelect_City_Multiple).selectOption("contains");

  const valueSelect_City_Multiple = page.locator('//input[@placeholder="value"]');
  await valueSelect_City_Multiple.click();
  await valueSelect_City_Multiple.fill(testData.CustomerCity);

 const AddFilterButton_Multiple= page.locator('//span//button[normalize-space()="Add a filter"]');
 await expect(AddFilterButton_Multiple).toBeVisible();
 await expect(AddFilterButton_Multiple).toBeEnabled();
 await AddFilterButton_Multiple.click();
 await page.waitForTimeout(3000);

 const columnSelectState_Multiple = page.locator("(//option[normalize-space(.)='Column']/ancestor::select)[2]");
 await columnSelectState_Multiple.click();
 await (columnSelectState_Multiple).selectOption("State");

 const operatorSelectState_Multiple = page.locator("(//div[normalize-space(.)='Operator is equal tocontains']//select)[2]");
 await operatorSelectState_Multiple.click();
 await (operatorSelectState_Multiple).selectOption("is equal to");

 const valueSelectState_Multiple = page.locator('(//input[@placeholder="value"])[2]');
 await valueSelectState_Multiple.click();
 await valueSelectState_Multiple.fill(testData.CustomerState);

 const applyButton_Multiple = page.getByRole('button', { name: 'Apply', exact: true });
 await expect(applyButton_Multiple).toBeEnabled();
 await applyButton_Multiple.click();
 await page.waitForTimeout(3000);

 const filtersButton_afterMultiple = page.getByRole('button', { name: 'Filters 2', exact: true });
 await expect(filtersButton_afterMultiple).toBeVisible();
 
 const customerRows_Multiple = page.locator('//table/thead//th[5]//following::tbody//tr//td[5]/div');
 const customerRows_Multiple_Text = await customerRows_Multiple.allTextContents();
 for (const text of customerRows_Multiple_Text) {
   expect(text.trim().toLowerCase()).toContain(testData.CustomerCity.trim().toLowerCase());
 }

 const customerRows_Multiple_State = page.locator('//table/thead//th[6]//following::tbody//tr//td[6]/div');
 const customerRows_Multiple_State_Text = await customerRows_Multiple_State.allTextContents();
 for (const text of customerRows_Multiple_State_Text) {
   expect(text.trim().toLowerCase()).toBe(testData.CustomerState.trim().toLowerCase());
 }

 const resetButton_afterMultiple = page.getByRole('button', { name: 'Reset', exact: true }).last();
 await expect(resetButton_afterMultiple).toBeVisible();
 await expect(resetButton_afterMultiple).toBeEnabled();
 await resetButton_afterMultiple.click();
 await page.waitForTimeout(3000);

 const filtersButton_afterResetMultiple = page.getByRole('button', { name: 'Filters 0', exact: true });
 await expect(filtersButton_afterResetMultiple).toBeVisible();
 await expect(columnSelectState_Multiple).not.toBeVisible();
}); 