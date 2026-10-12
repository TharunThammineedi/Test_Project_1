// TC13–16 — Create Prepress Request, assign user, push back / resolve (x2)
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Pushback of Prepress Request @regression', async ({ page }) => {
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

  // Push Back disabled until assigned
  const pushbackButtonDisabled = page.locator("//ui-tooltip//button[.//p[normalize-space()='Push Back']]");
  await expect(pushbackButtonDisabled).toBeVisible();
  await expect(pushbackButtonDisabled).not.toBeEnabled();

  // --- Assign user ---
  const selectUserButton = page.locator('(//button[normalize-space()="Select User"])[1]');
  await expect(selectUserButton).toBeVisible();
  await selectUserButton.click();

  const userQuickSearchInput = page.locator('(//input[@placeholder="Quick Search"])[2]');
  await expect(userQuickSearchInput).toBeVisible();
  await expect(userQuickSearchInput).toBeEditable();
  await userQuickSearchInput.fill(testData.userPicker);

  const assigneeCell = page.locator('td').filter({ hasText: testData.userPicker }).first();
  await expect(assigneeCell).toBeVisible();
  await assigneeCell.click();

  const assigneeDiv = page.locator('div').filter({ hasText: testData.userPicker }).first();
  await expect(assigneeDiv).toBeVisible();

  const continueUserButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueUserButton).toBeEnabled();
  await continueUserButton.click();

  const assigneeButton = page.getByRole('button', { name: testData.userPicker, exact: true });
  await expect(assigneeButton).toBeVisible();

  const assignedStatusBadge = page.locator('(//span[normalize-space()="Assigned" and @id="badge-Assigned"])[1]');
  await expect(assignedStatusBadge).toBeVisible();
  await expect(page.locator('#badge-Assigned').first()).toBeVisible();

  // --- First pushback (Incorrect Information) ---
  const pushBackButton = page.getByRole('button', { name: 'Push Back', exact: true });
  await expect(pushBackButton).toBeEnabled();
  await pushBackButton.click();

  const pushbackHeading = page.locator('h3').filter({ hasText: 'Pushback' }).first();
  await expect(pushbackHeading).toBeVisible();

  // Distinct from create-form note (hidden <p> on show page also holds description)
  const pushbackNoteFirst = `Pushback Incorrect: ${testData.description}`;

  const noteBodyTextarea = page.locator('textarea[name="noteBody"]');
  await expect(noteBodyTextarea).toBeEditable();
  await noteBodyTextarea.fill(pushbackNoteFirst);

  const informationCodeLabel = page.locator('label').filter({ hasText: 'Information Code' }).first();
  await expect(informationCodeLabel).toBeVisible();

  const pushBackCodeInput = page.locator('input[name="pushBackCode"][type="text"]');
  await pushBackCodeInput.click();

  const incorrectInformationOption = page.locator('li[data-label="Incorrect Information"]');
  await expect(incorrectInformationOption).toBeVisible();
  await expect(incorrectInformationOption).toBeEnabled();
  await incorrectInformationOption.click();

  const cancelPushbackButton = page.getByRole('button', { name: 'Cancel', exact: true });
  await expect(cancelPushbackButton).toBeVisible();

  const requestInformationButton = page.getByRole('button', { name: 'Request Information', exact: true });
  await expect(requestInformationButton).toBeEnabled();
  await requestInformationButton.click();

  const pushBackSubmittedText = page.locator('p').filter({ hasText: 'Push back submitted successfully.' }).first();
  await expect(pushBackSubmittedText).toBeVisible();

  const draftBadgeAfterPushback = page.locator('#badge-Draft');
  await expect(draftBadgeAfterPushback).toBeVisible();

  const pushbackNoteInList = page
    .locator('div.note-list-style')
    .filter({ hasText: pushbackNoteFirst })
    .first();
  await expect(pushbackNoteInList).toBeVisible();
  const noteAuthorRow = page
    .locator('//div[contains(@class,"flex-table-row")]')
    .filter({ hasText: testData.userPicker })
    .first();
  await expect(noteAuthorRow).toBeVisible();

  const pushbackAlert = page.getByRole('button', { name: 'Active pushback details', exact: true });
  await expect(pushbackAlert).toBeVisible();

  // --- Resolve first pushback ---
  const resolvePushBackButton = page.getByRole('button', { name: 'Resolve Push Back', exact: true });
  await expect(resolvePushBackButton).toBeEnabled();
  await resolvePushBackButton.click();

  await expect(page.getByRole('heading', { name: 'Resolve Pushback' })).toBeVisible();

  const resolutionTextarea = page.locator('textarea[name="resolveNoteBody"]');
  await expect(resolutionTextarea).toBeVisible();
  await expect(resolutionTextarea).toBeEditable();
  await resolutionTextarea.fill(testData.NoCustomerData);

  const cancelResolveButton = page.getByRole('button', { name: 'Cancel', exact: true });
  await expect(cancelResolveButton).toBeVisible();

  const resolvePushbackModalButton = page.getByRole('button', { name: 'Resolve Pushback', exact: true });
  await expect(resolvePushbackModalButton).toBeEnabled();
  await resolvePushbackModalButton.click();

  const pushbackResolvedMessage = page.locator('p').filter({ hasText: 'Push back resolved successfully.' }).first();
  await expect(pushbackResolvedMessage).toBeVisible();

  const requestedBadge = page.locator('#badge-Requested').first();
  await expect(requestedBadge).toBeVisible();
  await requestedBadge.click();

  await expect(
    page.locator(`//div[contains(@class,"note-list-style") and normalize-space()="${testData.NoCustomerData}"]`)
  ).toBeVisible();

  // --- Second pushback (Missing Information) ---
  await expect(pushBackButton).toBeEnabled();
  await pushBackButton.click();
  await expect(pushbackHeading).toBeVisible();

  await expect(noteBodyTextarea).toBeEditable();
  await noteBodyTextarea.fill(testData.pushbackNoteSecond);

  await expect(informationCodeLabel).toBeVisible();
  await pushBackCodeInput.click();

  const missingInformationOption = page.locator('li[data-label="Missing Information"]');
  await expect(missingInformationOption).toBeVisible();
  await expect(missingInformationOption).toBeEnabled();
  await missingInformationOption.click();

  await expect(cancelPushbackButton).toBeVisible();
  await expect(requestInformationButton).toBeEnabled();
  await requestInformationButton.click();

  await expect(pushBackSubmittedText).toBeVisible();
  await expect(draftBadgeAfterPushback).toBeVisible();
  await expect(pushbackAlert).toBeVisible();
  await expect(
    page.locator(`//div[contains(@class,"note-list-style") and normalize-space()="${testData.pushbackNoteSecond}"]`)
  ).toBeVisible();

  // --- Resolve second pushback ---
  await expect(resolvePushBackButton).toBeEnabled();
  await resolvePushBackButton.click();
  await expect(page.getByRole('heading', { name: 'Resolve Pushback' })).toBeVisible();

  await expect(resolutionTextarea).toBeVisible();
  await expect(resolutionTextarea).toBeEditable();
  await resolutionTextarea.fill(testData.CustomerTier);

  await expect(cancelResolveButton).toBeVisible();
  await expect(resolvePushbackModalButton).toBeEnabled();
  await resolvePushbackModalButton.click();

  await expect(pushbackResolvedMessage).toBeVisible();
  await expect(
    page.locator(`//div[contains(@class,"note-list-style") and normalize-space()="${testData.CustomerTier}"]`)
  ).toBeVisible();

  await expect(requestedBadge).toBeVisible();
  await requestedBadge.click();
});
