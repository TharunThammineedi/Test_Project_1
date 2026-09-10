import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Creation of Draft RFP @regression @set1', async ({ page }) => {
  
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  // 1. Go to login page
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

  const rfpMenuLink = page.getByRole('link', { name: 'Request For Proposals', exact: true }).first();
  await expect(rfpMenuLink).toBeVisible();
  await expect(rfpMenuLink).toBeEnabled();
  await rfpMenuLink.click();

  const newRfpLink = page.getByRole('link', { name: 'New Request for Proposal', exact: true }).first();
  await expect(newRfpLink).toBeVisible();
  await expect(newRfpLink).toBeEnabled();
  await newRfpLink.click();

  const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  const quickSearchInput = page.getByPlaceholder('Quick Search').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();
  await quickSearchInput.fill(testData.quickSearch);

  const customerCell = page.locator('td').filter({ hasText: 'Charles Lecrec' }).first();
  await expect(customerCell).toBeVisible();
  await expect(customerCell).toBeEnabled();
  await customerCell.click();

  const customerDiv = page.locator('div').filter({ hasText: 'Charles Lecrec' }).first();
  await expect(customerDiv).toBeVisible();
  await expect(customerDiv).toBeEnabled();
  await customerDiv.click();

  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();
  const cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  await expect(cancelButton).toBeVisible();

  const continueCustomerButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueCustomerButton).toBeEnabled();
  await continueCustomerButton.click();

  const addContactButton = page.getByRole('button', { name: 'Add Contact', exact: true });
  await expect(addContactButton).toBeEnabled();
  await addContactButton.click();

  const firstNameInput = page.locator('input[name="contact.first_name"][type="text"]');
  await expect(firstNameInput).toBeVisible();
  await expect(firstNameInput).toBeEditable();
  await firstNameInput.fill(testData.firstNameRequired);

  const lastNameInput = page.locator('input[name="contact.last_name"][type="text"]');
  await expect(lastNameInput).toBeVisible();
  await expect(lastNameInput).toBeEditable();
  await lastNameInput.fill(testData.lastNameRequired);

  const step2CheckDiv = page.locator('div').filter({ hasText: 'STEP 2 Check' }).first();
  await expect(step2CheckDiv).toBeVisible();
  await expect(step2CheckDiv).toBeEnabled();
  await step2CheckDiv.click();

  const step3PreviewDiv = page.locator('div').filter({ hasText: 'STEP 3 Preview' }).first();
  await expect(step3PreviewDiv).toBeVisible();
  await expect(step3PreviewDiv).toBeEnabled();
  await step3PreviewDiv.click();

  const continueContactButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueContactButton).toBeEnabled();
  await continueContactButton.click();
  await page.waitForTimeout(2000);

  const noMatchesButton = page.getByText('No, there are no matches', { exact: true });
  const yesAddRecordButton = page.locator('//button[normalize-space()="Yes, add record"]');

  await page.waitForTimeout(2000);

  if (await yesAddRecordButton.isVisible()) {
    await yesAddRecordButton.click();
  } else {
    await noMatchesButton.click();
    await expect(yesAddRecordButton).toBeVisible();
    await yesAddRecordButton.click();
  }

  await page.waitForTimeout(2000);
  const projectRadio = page.locator('#projectselect').last();
  await expect(projectRadio).toBeVisible();
  await projectRadio.check();
  await expect(projectRadio).toBeChecked();

  const opportunityNameInput = page.locator('//input[@placeholder="Enter the opportunity name"]');
  await expect(opportunityNameInput).toBeVisible();
  await expect(opportunityNameInput).toBeEditable();
  await opportunityNameInput.fill(testData.nameRequired);

  const opportunityDescriptionInput = page.locator('//input[contains(@name,"project_description")]').first();
  await expect(opportunityDescriptionInput).toBeVisible();
  await expect(opportunityDescriptionInput).toBeEditable();
  await opportunityDescriptionInput.fill(testData.description);

  const pricingTablePresetsFieldset = page.locator('fieldset').filter({ hasText: 'Pricing Table Presets' }).first();
  await expect(pricingTablePresetsFieldset).toBeVisible();
  await expect(pricingTablePresetsFieldset).toBeEnabled();
  await pricingTablePresetsFieldset.click();

  const salesUnitInput = page.locator('//input[contains(@name,"quantityUnitId")]');
  await expect(salesUnitInput).toBeVisible();
  await expect(salesUnitInput).toBeEnabled();
  await salesUnitInput.click();
  const feetOption = page.locator('li[data-label="Feet"]');
  await expect(feetOption).toBeVisible();
  await expect(feetOption).toBeEnabled();
  await feetOption.click();

  const quantityBreak1Input = page.locator('input[name="deliverableItemDTO.extension.quantityBreak1"][type="text"]');
  await expect(quantityBreak1Input).toBeVisible();
  await expect(quantityBreak1Input).toBeEditable();
  await quantityBreak1Input.fill(testData.quantityBreak1);

  const quotingOptionsFieldset = page.locator('fieldset').filter({ hasText: 'Quoting Options' }).first();
  await expect(quotingOptionsFieldset).toBeVisible();
  await expect(quotingOptionsFieldset).toBeEnabled();
  await quotingOptionsFieldset.click();


  const maxColorsInput = page.locator('input[name="deliverableItemDTO.extension.maxColorsToQuote"][type="text"]');
  await expect(maxColorsInput).toBeVisible();
  await expect(maxColorsInput).toBeEnabled();
  await maxColorsInput.click();
  const sixColorsOption = page.locator('li[data-label="2"]');
  if (!(await sixColorsOption.isVisible())) {
    await maxColorsInput.click();
  }
  await expect(sixColorsOption).toBeVisible();
  await expect(sixColorsOption).toBeEnabled();
  await sixColorsOption.click();

  const generalInfoDiv = page.locator('div').filter({ hasText: 'General Information' }).first();
  await expect(generalInfoDiv).toBeVisible();
  await expect(generalInfoDiv).toBeEnabled();
  await generalInfoDiv.click();

  const productClassInput = page.locator('input[name="deliverableItemDTO.productClassId"][type="text"]');
  await expect(productClassInput).toBeVisible();
  await expect(productClassInput).toBeEnabled();
  await productClassInput.click();
  const rfidLabelOption = page.locator('li[data-label="RFID Label"]');
  await expect(rfidLabelOption).toBeVisible();
  await expect(rfidLabelOption).toBeEnabled();
  await rfidLabelOption.click();

  const workflowInput = page.locator('input[name="deliverableItemSpecification.workflowId"][type="text"]');
  await expect(workflowInput).toBeVisible();
  await expect(workflowInput).toBeEnabled();
  await workflowInput.click();
  const rfidWorkflowOption = page.locator('li[data-label="RFID Digital Workflow"]');
  await expect(rfidWorkflowOption).toBeVisible();
  await expect(rfidWorkflowOption).toBeEnabled();
  await rfidWorkflowOption.click();

  const plantInput = page.locator('input[name="deliverableItemSpecification.plantId"][type="text"]');
  await expect(plantInput).toBeVisible();
  await expect(plantInput).toBeEnabled();
  await plantInput.click();
  const fortisOption = page.locator('li[data-label="Fortis (99)"]');
  await expect(fortisOption).toBeVisible();
  await expect(fortisOption).toBeEnabled();
  await fortisOption.click();

  const estimateDescriptionTextarea = page.locator('//label[@for="deliverableItemDTO.description"]/following-sibling::div/textarea');
  await expect(estimateDescriptionTextarea).toBeVisible();
  await expect(estimateDescriptionTextarea).toBeEnabled();
  await estimateDescriptionTextarea.click();
  await estimateDescriptionTextarea.fill(testData.descriptionRequired);

  const unitSetInput = page.locator('input[name="deliverableItemSpecification.unitSetTypeId"][type="text"]');
  await expect(unitSetInput).toBeVisible();
  await expect(unitSetInput).toBeEnabled();
  await unitSetInput.click();
  const rollOption = page.locator('li[data-label="Rolls/Boxed"]');
  await expect(rollOption).toBeVisible();
  await expect(rollOption).toBeEnabled();
  await rollOption.click();

  const coreDiameterInput = page.locator('input[name="deliverableItemSpecification.coreDiameterId"][type="text"]');
  await expect(coreDiameterInput).toBeVisible();
  await expect(coreDiameterInput).toBeEnabled();
  await coreDiameterInput.click();
  const oneInchOption = page.locator('(//li[@data-label="1"])[2]');
  await expect(oneInchOption).toBeVisible();
  await expect(oneInchOption).toBeEnabled();
  await oneInchOption.click();

  const applicationTempInput = page.locator('input[name="deliverableItemSpecification.applicationTemp"][type="text"]');
  await expect(applicationTempInput).toBeVisible();
  await expect(applicationTempInput).toBeEditable();
  await applicationTempInput.fill(testData.applicationTempRequired);

  const surfaceTypeInput = page.locator('input[name="deliverableItemSpecification.applicationSurfaceTypeValuelistOptionId"][type="text"]');
  await expect(surfaceTypeInput).toBeVisible();
  await expect(surfaceTypeInput).toBeEnabled();
  await surfaceTypeInput.click();
  const glassOption = page.locator('li[data-label="Glass"]');
  await expect(glassOption).toBeVisible();
  await expect(glassOption).toBeEnabled();
  await glassOption.click();

  const surfaceTempAfterInput = page.locator('input[name="deliverableItemSpecification.surfaceTempAfterApplication"][type="text"]')
  await expect(surfaceTempAfterInput).toBeVisible();
  await expect(surfaceTempAfterInput).toBeEditable();
  await surfaceTempAfterInput.fill(testData.surfaceTempAfter);

  const substrateInfoFieldset = page.locator('fieldset').filter({ hasText: 'Generic Substrate Information' }).first();
  await expect(substrateInfoFieldset).toBeVisible();
  await expect(substrateInfoFieldset).toBeEnabled();
  await substrateInfoFieldset.click();

  const appearanceColorInput = page.locator('input[name="deliverableItemSpecification.substrateColor"][type="text"]');
  await expect(appearanceColorInput).toBeVisible();
  await expect(appearanceColorInput).toBeEditable();
  await appearanceColorInput.fill(testData.appearanceColorRequired);

  const substrateFaceInput = page.locator('input[name="deliverableItemSpecification.substrateFace"][type="text"]');
  await expect(substrateFaceInput).toBeVisible();
  await expect(substrateFaceInput).toBeEditable();
  await substrateFaceInput.fill(testData.substrateFaceOrFacestock);

  const adhesiveInput = page.locator('input[name="deliverableItemSpecification.substrateAdhesive"][type="text"]');
  await expect(adhesiveInput).toBeVisible();
  await expect(adhesiveInput).toBeEditable();
  await adhesiveInput.fill(testData.adhesiveRequired);

  const linerInput = page.locator('input[name="deliverableItemSpecification.substrateLiner"][type="text"]');
  await expect(linerInput).toBeVisible();
  await expect(linerInput).toBeEditable();
  await linerInput.fill(testData.adhesiveRequired);

  const coatingInput = page.locator('input[name="deliverableItemSpecification.coatingTypeValuelistOptionId"][type="text"]');
  await expect(coatingInput).toBeVisible();
  await expect(coatingInput).toBeEnabled();
  await coatingInput.click();
  const uvGlossOption = page.locator('li[data-label="UV Gloss"]');
  await expect(uvGlossOption).toBeVisible();
  await expect(uvGlossOption).toBeEnabled();
  await uvGlossOption.click();

  const laminateInput = page.locator('input[name="deliverableItemSpecification.laminateTypeValuelistOptionId"][type="text"]');
  await expect(laminateInput).toBeVisible();
  await expect(laminateInput).toBeEnabled();
  await laminateInput.click();
  const ulLaminateOption = page.locator('li[data-label="UL Laminate"]');
  await expect(ulLaminateOption).toBeVisible();
  await expect(ulLaminateOption).toBeEnabled();
  await ulLaminateOption.click();

  const windDirectionInput = page.locator('input[name="deliverableItemSpecification.windDirectionId"][type="text"]');
  await expect(windDirectionInput).toBeVisible();
  await expect(windDirectionInput).toBeEnabled();
  await windDirectionInput.click();
  const leftFirstOption = page.locator('li[data-label="4 - Print out, Left first."]');
  await expect(leftFirstOption).toBeVisible();
  await expect(leftFirstOption).toBeEnabled();
  await leftFirstOption.click();

  const chooseUnitTemplatesButton = page.getByRole('button', { name: 'Choose Unit Templates', exact: true });
  await expect(chooseUnitTemplatesButton).toBeEnabled();
  await chooseUnitTemplatesButton.click();
 
  // Unit template quick search
  const unitTemplateQuickSearchInput = page.locator('input[placeholder="Quick Search"][data-flux-control]');
  await unitTemplateQuickSearchInput.fill(testData.unitTemplatePicker);
 
  const utm12991Div = page.locator('div').filter({ hasText: 'UTM12991' }).first();
  await expect(utm12991Div).toBeVisible();
  await utm12991Div.click();
 
  // Continue after unit template selection
  const continueButton4 = page.locator('//h3[normalize-space()="Choose Unit-Template-Picker"]//ancestor::div[4]//span[normalize-space()="Continue"]');
  await page.waitForTimeout(4000);
  await continueButton4.click();

  const createDraftButton = page.locator('//button[normalize-space()="Create Draft Request for Proposal"]');
  await expect(createDraftButton).toBeVisible();
  const createRequestButton = page.getByRole('button', { name: 'Create Request for Proposal', exact: true });
  await expect(createRequestButton).toBeVisible();

  await expect(createDraftButton).toBeEnabled();
  await createDraftButton.click();

  const rfpSuccessDiv = page.locator('div').filter({ hasText: 'Request for Proposal created successfully. Close' }).first();
  await expect(rfpSuccessDiv).toBeVisible();

  const statusDraftDiv = page.locator('div').filter({ hasText: 'Status Draft' }).first();
  await expect(statusDraftDiv).toBeVisible();
});