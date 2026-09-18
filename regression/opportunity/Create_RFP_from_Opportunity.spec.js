// Create RFP from Opportunity show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create RFP from Opportunity @regression @set1 @mainflow', async ({ page }) => {
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

  const customerMenuButton = page.locator('(//button[normalize-space()="Customer"])[1]');
  await expect(customerMenuButton).toBeVisible();
  await customerMenuButton.click();

  const opportunitiesLink = page.getByRole('link', { name: 'Opportunities', exact: true });
  await expect(opportunitiesLink).toBeVisible();
  await expect(opportunitiesLink).toBeEnabled();
  await opportunitiesLink.click();
  await page.waitForLoadState('domcontentloaded');

  const mineFilter = page.locator('//span[normalize-space()="Mine"]//following::button[1]');
  await expect(mineFilter).toBeVisible();
  await mineFilter.click();

  const oppCell = page.locator('//tbody//tr[2]//td[2]');
  await expect(oppCell).toBeVisible();
  const opportunityNumber = (await oppCell.innerText()).trim();
  console.log(`[data] opportunityNumber: ${opportunityNumber}`);
  await oppCell.click();
  await page.waitForTimeout(2000);

  const oppHeading = page.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first();
  await expect(oppHeading).toBeVisible();
  await expect(oppHeading).toBeEnabled();
  await oppHeading.click();

  const opportunityNameSpan = page.locator('//div[normalize-space()="Name"]/following-sibling::div//span').first();
  await expect(opportunityNameSpan).toBeVisible();
  const opportunityName = (await opportunityNameSpan.innerText()).trim();
  console.log(`[data] opportunityName: ${opportunityName}`);

  const customerLeadRaw = (
    await page.locator('//div[normalize-space()="Customer/Lead"]/following-sibling::div').first().innerText()
  ).trim();
  const customerName = customerLeadRaw.includes(' - ')
    ? customerLeadRaw.split(/\s*-\s*/).slice(1).join(' - ').trim()
    : customerLeadRaw;
  console.log(`[data] customerLeadRaw: ${customerLeadRaw}`);
  console.log(`[data] customerName: ${customerName}`);

  const newRfpLink = page.locator('//span[text()="New Request for Proposal"]');
  await expect(newRfpLink).toBeVisible();
  const [rfpPage] = await Promise.all([
    page.context().waitForEvent('page'),
    newRfpLink.click(),
  ]);

  await rfpPage.waitForLoadState('domcontentloaded');
  await rfpPage.waitForTimeout(3000);

  const rfpFormHeading = rfpPage.locator('//h2[normalize-space()="Request for Proposal Information"]').first();
  await expect(rfpFormHeading).toBeVisible();

  const customerOnRfp = rfpPage.locator(
    `//div[normalize-space()='Customer']/following-sibling::div//div[normalize-space()='${customerName}']`
  ).first();
  await expect(customerOnRfp).toBeVisible();
  const customerOnRfpText = (await customerOnRfp.innerText()).trim();
  console.log(`[data] customerOnRfpText: ${customerOnRfpText}`);
  expect(customerOnRfpText.toLowerCase()).toBe(customerName.toLowerCase());

  const opportunityOnRfp = rfpPage.locator(
    `//div[normalize-space()='Opportunity']/following-sibling::div//div[normalize-space()='${opportunityName}']`
  ).first();
  await expect(opportunityOnRfp).toBeVisible();
  const opportunityOnRfpText = (await opportunityOnRfp.innerText()).trim();
  console.log(`[data] opportunityOnRfpText: ${opportunityOnRfpText}`);
  expect(opportunityOnRfpText.toLowerCase()).toBe(opportunityName.toLowerCase());

  const pricingTablePresetsFieldset = rfpPage.locator('fieldset').filter({ hasText: 'Pricing Table Presets' }).first();
  await expect(pricingTablePresetsFieldset).toBeVisible();
  await expect(pricingTablePresetsFieldset).toBeEnabled();
  await pricingTablePresetsFieldset.click();

  const salesUnitInput = rfpPage.locator('//input[contains(@name,"quantityUnitId")]');
  await expect(salesUnitInput).toBeVisible();
  await expect(salesUnitInput).toBeEnabled();
  await salesUnitInput.click();
  const feetOption = rfpPage.locator('li[data-label="Feet"]');
  await expect(feetOption).toBeVisible();
  await expect(feetOption).toBeEnabled();
  await feetOption.click();

  const quantityBreak1Input = rfpPage.locator('input[name="deliverableItemDTO.extension.quantityBreak1"][type="text"]');
  await expect(quantityBreak1Input).toBeVisible();
  await expect(quantityBreak1Input).toBeEditable();
  await quantityBreak1Input.fill(testData.quantityBreak1);

  const quotingOptionsFieldset = rfpPage.locator('fieldset').filter({ hasText: 'Quoting Options' }).first();
  await expect(quotingOptionsFieldset).toBeVisible();
  await expect(quotingOptionsFieldset).toBeEnabled();
  await quotingOptionsFieldset.click();

  const maxColorsInput = rfpPage.locator('input[name="deliverableItemDTO.extension.maxColorsToQuote"][type="text"]');
  await expect(maxColorsInput).toBeVisible();
  await expect(maxColorsInput).toBeEnabled();
  await maxColorsInput.click();
  const twoColorsOption = rfpPage.locator('li[data-label="2"]');
  if (!(await twoColorsOption.isVisible())) {
    await maxColorsInput.click();
  }
  await expect(twoColorsOption).toBeVisible();
  await expect(twoColorsOption).toBeEnabled();
  await twoColorsOption.click();

  const generalInfoDiv = rfpPage.locator('div').filter({ hasText: 'General Information' }).first();
  await expect(generalInfoDiv).toBeVisible();
  await expect(generalInfoDiv).toBeEnabled();
  await generalInfoDiv.click();

  const productClassInput = rfpPage.locator('input[name="deliverableItemDTO.productClassId"][type="text"]');
  await expect(productClassInput).toBeVisible();
  await expect(productClassInput).toBeEnabled();
  await productClassInput.click();
  const rfidLabelOption = rfpPage.locator('li[data-label="RFID Label"]');
  await expect(rfidLabelOption).toBeVisible();
  await expect(rfidLabelOption).toBeEnabled();
  await rfidLabelOption.click();

  const workflowInput = rfpPage.locator('input[name="deliverableItemSpecification.workflowId"][type="text"]');
  await expect(workflowInput).toBeVisible();
  await expect(workflowInput).toBeEnabled();
  await workflowInput.click();
  const rfidWorkflowOption = rfpPage.locator('li[data-label="RFID Digital Workflow"]');
  await expect(rfidWorkflowOption).toBeVisible();
  await expect(rfidWorkflowOption).toBeEnabled();
  await rfidWorkflowOption.click();

  const plantInput = rfpPage.locator('input[name="deliverableItemSpecification.plantId"][type="text"]');
  await expect(plantInput).toBeVisible();
  await expect(plantInput).toBeEnabled();
  await plantInput.click();
  const fortisOption = rfpPage.locator('li[data-label="Fortis (99)"]');
  await expect(fortisOption).toBeVisible();
  await expect(fortisOption).toBeEnabled();
  await fortisOption.click();

  const estimateDescriptionTextarea = rfpPage.locator('//label[@for="deliverableItemDTO.description"]/following-sibling::div/textarea');
  await expect(estimateDescriptionTextarea).toBeVisible();
  await expect(estimateDescriptionTextarea).toBeEnabled();
  await estimateDescriptionTextarea.click();
  await estimateDescriptionTextarea.fill(testData.descriptionRequired);

  const unitSetInput = rfpPage.locator('input[name="deliverableItemSpecification.unitSetTypeId"][type="text"]');
  await expect(unitSetInput).toBeVisible();
  await expect(unitSetInput).toBeEnabled();
  await unitSetInput.click();
  const rollOption = rfpPage.locator('li[data-label="Rolls/Boxed"]');
  await expect(rollOption).toBeVisible();
  await expect(rollOption).toBeEnabled();
  await rollOption.click();

  const coreDiameterInput = rfpPage.locator('input[name="deliverableItemSpecification.coreDiameterId"][type="text"]');
  await expect(coreDiameterInput).toBeVisible();
  await expect(coreDiameterInput).toBeEnabled();
  await coreDiameterInput.click();
  const oneInchOption = rfpPage.locator('(//li[@data-label="1"])[2]');
  await expect(oneInchOption).toBeVisible();
  await expect(oneInchOption).toBeEnabled();
  await oneInchOption.click();

  const applicationTempInput = rfpPage.locator('input[name="deliverableItemSpecification.applicationTemp"][type="text"]');
  await expect(applicationTempInput).toBeVisible();
  await expect(applicationTempInput).toBeEditable();
  await applicationTempInput.fill(testData.applicationTempRequired);

  const surfaceTypeInput = rfpPage.locator('input[name="deliverableItemSpecification.applicationSurfaceTypeValuelistOptionId"][type="text"]');
  await expect(surfaceTypeInput).toBeVisible();
  await expect(surfaceTypeInput).toBeEnabled();
  await surfaceTypeInput.click();
  const glassOption = rfpPage.locator('li[data-label="Glass"]');
  await expect(glassOption).toBeVisible();
  await expect(glassOption).toBeEnabled();
  await glassOption.click();

  const surfaceTempAfterInput = rfpPage.locator('input[name="deliverableItemSpecification.surfaceTempAfterApplication"][type="text"]');
  await expect(surfaceTempAfterInput).toBeVisible();
  await expect(surfaceTempAfterInput).toBeEditable();
  await surfaceTempAfterInput.fill(testData.surfaceTempAfter);

  const substrateInfoFieldset = rfpPage.locator('fieldset').filter({ hasText: 'Generic Substrate Information' }).first();
  await expect(substrateInfoFieldset).toBeVisible();
  await expect(substrateInfoFieldset).toBeEnabled();
  await substrateInfoFieldset.click();

  const appearanceColorInput = rfpPage.locator('input[name="deliverableItemSpecification.substrateColor"][type="text"]');
  await expect(appearanceColorInput).toBeVisible();
  await expect(appearanceColorInput).toBeEditable();
  await appearanceColorInput.fill(testData.appearanceColorRequired);

  const substrateFaceInput = rfpPage.locator('input[name="deliverableItemSpecification.substrateFace"][type="text"]');
  await expect(substrateFaceInput).toBeVisible();
  await expect(substrateFaceInput).toBeEditable();
  await substrateFaceInput.fill(testData.substrateFaceOrFacestock);

  const adhesiveInput = rfpPage.locator('input[name="deliverableItemSpecification.substrateAdhesive"][type="text"]');
  await expect(adhesiveInput).toBeVisible();
  await expect(adhesiveInput).toBeEditable();
  await adhesiveInput.fill(testData.adhesiveRequired);

  const linerInput = rfpPage.locator('input[name="deliverableItemSpecification.substrateLiner"][type="text"]');
  await expect(linerInput).toBeVisible();
  await expect(linerInput).toBeEditable();
  await linerInput.fill(testData.adhesiveRequired);

  const coatingInput = rfpPage.locator('input[name="deliverableItemSpecification.coatingTypeValuelistOptionId"][type="text"]');
  await expect(coatingInput).toBeVisible();
  await expect(coatingInput).toBeEnabled();
  await coatingInput.click();
  const uvGlossOption = rfpPage.locator('li[data-label="UV Gloss"]');
  await expect(uvGlossOption).toBeVisible();
  await expect(uvGlossOption).toBeEnabled();
  await uvGlossOption.click();

  const laminateInput = rfpPage.locator('input[name="deliverableItemSpecification.laminateTypeValuelistOptionId"][type="text"]');
  await expect(laminateInput).toBeVisible();
  await expect(laminateInput).toBeEnabled();
  await laminateInput.click();
  const ulLaminateOption = rfpPage.locator('li[data-label="UL Laminate"]');
  await expect(ulLaminateOption).toBeVisible();
  await expect(ulLaminateOption).toBeEnabled();
  await ulLaminateOption.click();

  const windDirectionInput = rfpPage.locator('input[name="deliverableItemSpecification.windDirectionId"][type="text"]');
  await expect(windDirectionInput).toBeVisible();
  await expect(windDirectionInput).toBeEnabled();
  await windDirectionInput.click();
  const leftFirstOption = rfpPage.locator('li[data-label="4 - Print out, Left first."]');
  await expect(leftFirstOption).toBeVisible();
  await expect(leftFirstOption).toBeEnabled();
  await leftFirstOption.click();

  const chooseUnitTemplatesButton = rfpPage.getByRole('button', { name: 'Choose Unit Templates', exact: true });
  await expect(chooseUnitTemplatesButton).toBeEnabled();
  await chooseUnitTemplatesButton.click();

  const unitTemplateQuickSearchInput = rfpPage.locator('input[placeholder="Quick Search"][data-flux-control]');
  await unitTemplateQuickSearchInput.fill(testData.unitTemplatePicker);

  const utmDiv = rfpPage.locator('div').filter({ hasText: testData.unitTemplatePicker }).first();
  await expect(utmDiv).toBeVisible();
  await utmDiv.click();

  const continueButton = rfpPage.locator('//h3[normalize-space()="Choose Unit-Template-Picker"]//ancestor::div[4]//span[normalize-space()="Continue"]');
  await continueButton.click();

  const createRfpButton = rfpPage.getByRole('button', {
    name: 'Create Request for Proposal',
    exact: true,
  });
  await expect(createRfpButton).toBeEnabled();
  await createRfpButton.click();

  const rfpSuccessMessage = rfpPage.getByText('Request for Proposal created successfully.', { exact: true });
  await expect(rfpSuccessMessage).toBeVisible({ timeout: 60000 });
  await rfpPage.waitForTimeout(2000);

  const rfpHeading = rfpPage.getByRole('heading', {
    name: /RFP\d+ - Request for Proposal/,
  });
  await expect(rfpHeading).toBeVisible();
  const rfpHeadingText = (await rfpHeading.innerText()).trim();
  const rfpNumber = rfpHeadingText.split(' - ')[0].trim();
  console.log(`[data] rfpNumber: ${rfpNumber}`);
  await expect(rfpHeading).toBeEnabled();
  await rfpHeading.click();

  const opportunityLinkDiv = rfpPage.locator('div').filter({ hasText: `Opportunity ${opportunityName}` }).first();
  await expect(opportunityLinkDiv).toBeVisible();
  await expect(opportunityLinkDiv).toBeEnabled();
  await opportunityLinkDiv.click();

  const openLink = rfpPage.locator("//div[normalize-space()='Opportunity']/following-sibling::div//a[.//div[@x-tooltip='Open']]");
  await expect(openLink).toBeVisible();
  await expect(openLink).toBeEnabled();
  await openLink.click();

  const oppBackHeading = rfpPage.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first();
  await expect(oppBackHeading).toBeVisible();
  await expect(oppBackHeading).toBeEnabled();
  await oppBackHeading.click();

  const rfpOnOppDiv = rfpPage.locator('div').filter({ hasText: rfpNumber }).first();
  await expect(rfpOnOppDiv).toBeVisible();
  await expect(rfpOnOppDiv).toBeEnabled();
  await rfpOnOppDiv.click();
  await rfpOnOppDiv.click();
});
