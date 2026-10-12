// TC09/10 — Create Prepress Request from Queue, then assign / reassign user
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create Prepress Request and Assign User @regression', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → description: ${session.description}`);

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

  const unassignedDiv = page.locator('div').filter({ hasText: 'Unassigned' }).first();
  await expect(unassignedDiv).toBeVisible();

  const productRoutesHeader = page.locator('th').filter({ hasText: 'PRODUCT ROUTES ON REQUEST' }).first();
  await expect(productRoutesHeader).toBeVisible();

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeVisible();

  const newPrepressRequestLink = page.getByRole('link', { name: 'New Prepress Request', exact: true });
  await expect(newPrepressRequestLink).toBeEnabled();
  await newPrepressRequestLink.click();
  await page.waitForLoadState('domcontentloaded');

  const newPrepressRequestLabel = page.locator('label').filter({ hasText: 'New Prepress Request' }).first();
  await expect(newPrepressRequestLabel).toBeVisible();

  const requestTypeHeading = page.locator('h2').filter({ hasText: 'Request Type' }).first();
  await expect(requestTypeHeading).toBeVisible();

  const customerHeading = page.locator('h2').filter({ hasText: 'Customer' }).first();
  await expect(customerHeading).toBeVisible();

  const requestTypeInput = page.locator('input[name="prepressRequest.task_name"][type="text"]');
  await expect(requestTypeInput).toBeVisible();
  await expect(requestTypeInput).toBeEnabled();
  await requestTypeInput.click();

  const createDielineOption = page.locator('li[data-label="Create Dieline"]');
  await expect(createDielineOption).toBeVisible();
  await expect(createDielineOption).toBeEnabled();
  await createDielineOption.click();

  const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  const chooseCustomerHeading = page.locator('h3').filter({ hasText: 'Choose Customer / Lead' }).first();
  await expect(chooseCustomerHeading).toBeVisible();

  const customerQuickSearchInput = page.getByPlaceholder('Quick Search').first();
  await expect(customerQuickSearchInput).toBeVisible();
  await expect(customerQuickSearchInput).toBeEditable();
  await customerQuickSearchInput.fill(testData.quickSearch);

  const customerCell = page.locator('td').filter({ hasText: testData.customerName }).first();
  await expect(customerCell).toBeVisible();
  await expect(customerCell).toBeEnabled();
  await page.waitForTimeout(2000);
  await customerCell.click();

  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();

  const continueCustomerPickerButton = page.getByRole('button', { name: 'Continue', exact: true }).first();
  await expect(continueCustomerPickerButton).toBeEnabled();
  await continueCustomerPickerButton.click();

  const selectedCustomerButton = page.getByRole('button', { name: testData.customerName, exact: true });
  await expect(selectedCustomerButton).toBeVisible();
  await expect(selectedCustomerButton).toBeEnabled();

  const chooseUnitTemplatesButton = page.getByRole('button', { name: 'Choose Unit Templates', exact: true });
  await expect(chooseUnitTemplatesButton).toBeEnabled();
  await chooseUnitTemplatesButton.click();

  const unitTemplatePickerHeading = page.locator('//h3[normalize-space()="Choose Unit-Template-Picker"]');
  await expect(unitTemplatePickerHeading).toBeVisible();

  const unitTemplateQuickSearchInput = page.locator('input[placeholder="Quick Search"][data-flux-control]');
  await expect(unitTemplateQuickSearchInput).toBeVisible();
  await expect(unitTemplateQuickSearchInput).toBeEditable();
  await page.waitForTimeout(2000);
  await unitTemplateQuickSearchInput.click();
  await unitTemplateQuickSearchInput.fill(testData.unitTemplatePicker);

  const unitTemplateResult = page.locator('td').filter({ hasText: testData.unitTemplatePicker }).first();
  await expect(unitTemplateResult).toBeVisible();
  await expect(unitTemplateResult).toBeEnabled();
  await unitTemplateResult.click();

  const unitTemplateContinueButton = page.locator(
    '//h3[normalize-space()="Choose Unit-Template-Picker"]' +
    '//ancestor::div[4]//span[normalize-space()="Continue"]'
  );
  await expect(unitTemplateContinueButton).toBeEnabled();
  await unitTemplateContinueButton.click();

  const plantInput = page.locator('input[name="prepressRequest.plant_id"][type="text"]');
  await expect(plantInput).toBeVisible();
  await expect(plantInput).toBeEnabled();
  await plantInput.click();

  const plantOption = page.locator('li[data-label="Cordova, TN (27)"]');
  await expect(plantOption).toBeVisible();
  await expect(plantOption).toBeEnabled();
  await plantOption.click();

  const printMethodInput = page.locator('input[name="prepressRequest.print_method_id"][type="text"]');
  await expect(printMethodInput).toBeVisible();
  await expect(printMethodInput).toBeEnabled();
  await printMethodInput.click();

  const printMethodOption = page.locator('li[data-label="Digital"]');
  await expect(printMethodOption).toBeVisible();
  await expect(printMethodOption).toBeEnabled();
  await printMethodOption.click();

  const productFamilyInput = page.locator('input[name="prepressRequest.product_family_id"][type="text"]');
  await expect(productFamilyInput).toBeVisible();
  await expect(productFamilyInput).toBeEnabled();
  await productFamilyInput.click();

  const productFamilyOption = page.locator('li[data-label="Ancillary Product"]');
  await expect(productFamilyOption).toBeVisible();
  await expect(productFamilyOption).toBeEnabled();
  await productFamilyOption.click();

  const dueAtInput = page.locator('#due_at');
  await expect(dueAtInput).toBeVisible();
  await expect(dueAtInput).toBeEnabled();
  await dueAtInput.click();

  const dayPicker = page.locator(
    '//span[contains(@class,"flatpickr-day") and normalize-space()="15" and not(contains(@class,"prevMonthDay")) and not(contains(@class,"nextMonthDay"))]'
  );
  await expect(dayPicker).toBeVisible();
  await expect(dayPicker).toBeEnabled();
  await dayPicker.click();
  await expect(dueAtInput).toHaveValue(/15/);
  await page.waitForTimeout(2000);

  const noteInput = page.locator(
    '//label[normalize-space()="Note for Request"]//following::textarea[@name="prepressRequest.note"]'
  );
  await expect(noteInput).toBeVisible();
  await expect(noteInput).toBeEditable();
  await noteInput.fill(testData.description);
  await expect(noteInput).toHaveValue(testData.description);

  const backToPrepressQueueButton = page.getByRole('button', { name: 'Back to Prepress Queue', exact: true });
  await expect(backToPrepressQueueButton).toBeVisible();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();
  await page.waitForLoadState('domcontentloaded');

  const requestCreatedText = page.locator('p').filter({ hasText: 'Prepress Request Created Successfully' }).first();
  await expect(requestCreatedText).toBeVisible();

  const pprRequest = page.locator('//span[contains(@class,"title") and contains(normalize-space(),"Request #")]');
  await expect(pprRequest).toBeVisible();
  const pprText = await pprRequest.innerText();
  const pprId = pprText.replace('Request #', '').trim();
  console.log(`[data] prepressRequestId: ${pprId}`);
  expect(pprId.length).toBeGreaterThan(0);

  const draftBadge = page.locator('//span[normalize-space()="Draft" and @id="badge-Draft"]').first();
  await expect(draftBadge).toBeVisible();

  const detailsTab = page.locator('[data-cy="hub-tab-details"]').first();
  await expect(detailsTab).toBeVisible();

  const productRoutesHeading = page.locator('h3').filter({ hasText: 'Product Routes / Art Sets' }).first();
  await expect(productRoutesHeading).toBeVisible();

  const draftIcon = page.locator(
    '//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]'
  );
  await expect(draftIcon).toBeVisible();
  await expect(draftIcon).toHaveCount(1);

  // --- Assign user ---
  const selectUserButton = page.locator('(//button[normalize-space()="Select User"])[1]');
  await expect(selectUserButton).toBeVisible();
  await selectUserButton.click();

  const chooseUserHeading = page.locator('//h3[normalize-space()="Choose User"]').first();
  await expect(chooseUserHeading).toBeVisible();

  const userQuickSearchInput = page.locator('(//input[@placeholder="Quick Search"])[2]');
  await expect(userQuickSearchInput).toBeVisible();
  await expect(userQuickSearchInput).toBeEditable();
  await userQuickSearchInput.fill(testData.userPicker);

  const firstAssigneeCell = page.locator('td').filter({ hasText: testData.userPicker }).first();
  await expect(firstAssigneeCell).toBeVisible();
  await firstAssigneeCell.click();

  const firstAssigneeDiv = page.locator('div').filter({ hasText: testData.userPicker }).first();
  await expect(firstAssigneeDiv).toBeVisible();

  const continueUserButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueUserButton).toBeEnabled();
  await continueUserButton.click();

  const firstAssigneeButton = page.getByRole('button', { name: testData.userPicker, exact: true });
  await expect(firstAssigneeButton).toBeVisible();

  const assignedStatusBadge = page.locator('(//span[normalize-space()="Assigned" and @id="badge-Assigned"])[1]');
  await expect(assignedStatusBadge).toBeVisible();

  // --- Reassign user ---
  await expect(firstAssigneeButton).toBeVisible();
  await firstAssigneeButton.click();

  await expect(chooseUserHeading).toBeVisible();

  const userQuickSearchInputReassign = page.locator('(//input[@placeholder="Quick Search"])[2]');
  await expect(userQuickSearchInputReassign).toBeVisible();
  await expect(userQuickSearchInputReassign).toBeEditable();
  await userQuickSearchInputReassign.fill(testData.userPicker_2);

  const secondAssigneeCell = page.locator('td').filter({ hasText: testData.userPicker_2 }).first();
  await expect(secondAssigneeCell).toBeVisible();
  await secondAssigneeCell.click();

  const secondAssigneeDiv = page.locator('div').filter({ hasText: testData.userPicker_2 }).first();
  await expect(secondAssigneeDiv).toBeVisible();

  await expect(continueUserButton).toBeEnabled();
  await continueUserButton.click();

  const secondAssigneeButton = page.getByRole('button', { name: 'JAY ALLYSON Fortis (99)', exact: true });
  await expect(secondAssigneeButton).toBeVisible();
  await expect(assignedStatusBadge).toBeVisible();
});
