// Create Estimate from Opportunity show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create Estimate from Opportunity @regression @set1 @mainflow', async ({ page }) => {
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

  const oppCell = page.locator('//tbody//tr[1]//td[2]');
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

  const newEstimateLink = page.locator('//span[text()="New Estimate"]').first();
  await expect(newEstimateLink).toBeVisible();
  const [estimatePage] = await Promise.all([
    page.context().waitForEvent('page'),
    newEstimateLink.click(),
  ]);

  await estimatePage.waitForLoadState('domcontentloaded');
  await estimatePage.waitForTimeout(3000);

  const estimateFormHeading = estimatePage.locator('//h2[normalize-space()="Estimate Information"]').first();
  await expect(estimateFormHeading).toBeVisible();

  const customerOnEstimate = estimatePage.locator(
    `//div[normalize-space()='Customer']/following-sibling::div//div[normalize-space()='${customerName}']`
  ).first();
  await expect(customerOnEstimate).toBeVisible();
  const customerOnEstimateText = (await customerOnEstimate.innerText()).trim();
  console.log(`[data] customerOnEstimateText: ${customerOnEstimateText}`);
  expect(customerOnEstimateText.toLowerCase()).toBe(customerName.toLowerCase());

  const opportunityOnEstimate = estimatePage.locator(
    `//div[normalize-space()='Opportunity']/following-sibling::div//div[normalize-space()='${opportunityName}']`
  ).first();
  await expect(opportunityOnEstimate).toBeVisible();
  const opportunityOnEstimateText = (await opportunityOnEstimate.innerText()).trim();
  console.log(`[data] opportunityOnEstimateText: ${opportunityOnEstimateText}`);
  expect(opportunityOnEstimateText.toLowerCase()).toBe(opportunityName.toLowerCase());

  const quantityUnitInput = estimatePage.locator("xpath=//input[@name='deliverableItemDTO.extension.quantityUnitId']");
  await expect(quantityUnitInput).toBeEnabled();
  await quantityUnitInput.click();
  const metersOption = estimatePage.locator('li[data-label="Meters"]');
  await expect(metersOption).toBeEnabled();
  await metersOption.click();

  const quantityBreakInput = estimatePage.locator("xpath=//input[@name='deliverableItemDTO.extension.quantityBreak1']");
  await expect(quantityBreakInput).toBeEnabled();
  await quantityBreakInput.click();
  await quantityBreakInput.fill(testData.quantityBreak1);

  const maxColorsInput = estimatePage.locator("xpath=//input[@name='deliverableItemDTO.extension.maxColorsToQuote']");
  await expect(maxColorsInput).toBeEnabled();
  await maxColorsInput.click();
  const colorsOption = estimatePage.locator('li[data-label="2"]');
  await expect(colorsOption).toBeEnabled();
  await colorsOption.click();

  const productClassInput = estimatePage.locator("xpath=//input[@name='deliverableItemDTO.productClassId']");
  await expect(productClassInput).toBeEnabled();
  await productClassInput.click();
  const primeLabelOption = estimatePage.locator('li[data-label="Prime Label"]');
  await expect(primeLabelOption).toBeEnabled();
  await expect(primeLabelOption).toBeVisible();
  await primeLabelOption.click();
  await expect(productClassInput).toHaveValue('Prime Label');

  const workflowInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.workflowId']");
  await expect(workflowInput).toBeEnabled();
  await workflowInput.click();
  const standardDigitalLabelOption = estimatePage.locator('li[data-label="Standard Digital Label"]');
  await expect(standardDigitalLabelOption).toBeEnabled();
  await standardDigitalLabelOption.click();

  const plantInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.plantId']");
  await expect(plantInput).toBeEnabled();
  await plantInput.click();
  const fortisOption = estimatePage.locator('li[data-label="Fortis (99)"]');
  await expect(fortisOption).toBeEnabled();
  await fortisOption.click();

  const descriptionInput = estimatePage.locator("xpath=//textarea[@id='deliverableItemDTO.description']");
  await descriptionInput.fill(testData.descriptionRequired);

  const unitSetInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.unitSetTypeId']");
  await expect(unitSetInput).toBeEnabled();
  await unitSetInput.click();
  const rollsBoxedOption = estimatePage.locator('li[data-label="Rolls/Boxed"]');
  await expect(rollsBoxedOption).toBeEnabled();
  await rollsBoxedOption.click();

  const coreDiameterInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.coreDiameterId']");
  await expect(coreDiameterInput).toBeEnabled();
  await coreDiameterInput.click();
  const coreDiameterOption = estimatePage.locator('(//li[@data-label="1"])[2]');
  await coreDiameterOption.click();

  const applicationTypeInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.applicationType']");
  await expect(applicationTypeInput).toBeEnabled();
  await applicationTypeInput.click();
  const handOption = estimatePage.locator('li[data-label="Hand"]');
  await expect(handOption).toBeEnabled();
  await handOption.click();

  const applicationTempInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.applicationTemp']");
  await expect(applicationTempInput).toBeEditable();
  await applicationTempInput.fill(testData.applicationTempRequired);

  const surfaceTypeInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.applicationSurfaceTypeValuelistOptionId']");
  await expect(surfaceTypeInput).toBeEnabled();
  await surfaceTypeInput.click();
  const petgOption = estimatePage.locator('li[data-label="PETg"]');
  await expect(petgOption).toBeEnabled();
  await petgOption.click();

  const surfaceTempAfterInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.surfaceTempAfterApplication']");
  await expect(surfaceTempAfterInput).toBeEditable();
  await surfaceTempAfterInput.fill(testData.surfaceTempAfter);

  const appearanceColorInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.substrateColor']");
  await expect(appearanceColorInput).toBeEditable();
  await appearanceColorInput.fill(testData.appearanceColorRequired);

  const substrateFaceInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.substrateFace']");
  await expect(substrateFaceInput).toBeEditable();
  await substrateFaceInput.fill(testData.substrateFaceOrFacestock);

  const adhesiveInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.substrateAdhesive']");
  await expect(adhesiveInput).toBeEditable();
  await adhesiveInput.fill(testData.adhesiveRequired);

  const linerInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.substrateLiner']");
  await expect(linerInput).toBeEditable();
  await linerInput.fill(testData.linerRequired);

  const coating = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.coatingTypeValuelistOptionId']");
  await expect(coating).toBeEnabled();
  await coating.click();
  const coatingOption = estimatePage.locator('li[data-label="UV Matte"]');
  await expect(coatingOption).toBeEnabled();
  await coatingOption.click();
  await expect(coating).toHaveValue('UV Matte');

  const laminate = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.laminateTypeValuelistOptionId']");
  await expect(laminate).toBeEnabled();
  await laminate.click();
  const laminateOption = estimatePage.locator('li[data-label="Gloss Laminate"]');
  await expect(laminateOption).toBeEnabled();
  await laminateOption.click();
  await expect(laminate).toHaveValue('Gloss Laminate');

  const windDirectionButton = estimatePage.getByRole('button', {
    name: '7 - Print in, Right first.',
    exact: true
  });
  await expect(windDirectionButton).toBeEnabled();
  await windDirectionButton.click();

  const chooseUnitTemplatesButton = estimatePage.getByRole('button', {
    name: 'Choose Unit Templates',
    exact: true
  });
  await expect(chooseUnitTemplatesButton).toBeEnabled();
  await chooseUnitTemplatesButton.click();

  const unitTemplateQuickSearchInput = estimatePage.locator("xpath=//div[@id='unit-template-picker-picker-unit-template-picker-unit-template-component-pc-2']//input[@placeholder='Quick Search']");
  await unitTemplateQuickSearchInput.fill(testData.unitTemplatePicker);

  const unitTemplateResult = estimatePage.locator('div').filter({ hasText: testData.unitTemplatePicker }).first();
  await expect(unitTemplateResult).toBeVisible();
  await expect(unitTemplateResult).toBeEnabled();
  await unitTemplateResult.click();

  const continueButton4 = estimatePage.locator(
    '//h3[normalize-space()="Choose Unit-Template-Picker"]' +
    '//ancestor::div[4]//span[normalize-space()="Continue"]'
  );
  await continueButton4.click();

  const chooseMaterialItemButton = estimatePage.getByRole('button', { name: 'Choose Material Item', exact: true }).first();
  await expect(chooseMaterialItemButton).toBeEnabled();
  await chooseMaterialItemButton.click();

  await expect(estimatePage.locator('h3').filter({ hasText: /^Choose Material Item$/ }).first()).toBeVisible();

  const MaterialItemquickSearchInput = estimatePage.locator("xpath=//input[contains(concat(' ', normalize-space(@class), ' '), ' ps-10 ') and @type='text']");
  await expect(MaterialItemquickSearchInput).toBeVisible();
  await expect(MaterialItemquickSearchInput).toBeEditable();
  await MaterialItemquickSearchInput.fill(testData.MaterialItemquickSearch);

  const firstMaterialCell = estimatePage.locator('td').filter({ hasText: testData.MaterialItemquickSearch }).first();
  await expect(firstMaterialCell).toBeVisible();
  await expect(firstMaterialCell).toBeEnabled();
  await firstMaterialCell.click();

  const unlinkButton = estimatePage.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();

  const continueButton = estimatePage.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  const chooseMaterialItemButton_laminate = estimatePage.getByRole('button', { name: 'Choose Material Item', exact: true }).first();
  await expect(chooseMaterialItemButton_laminate).toBeEnabled();
  await chooseMaterialItemButton_laminate.click();

  const FinishMaterialquickSearchInput = estimatePage.locator("xpath=//div[normalize-space(.)='Choose Material Item']/following::input[@placeholder='Quick Search']");
  await expect(FinishMaterialquickSearchInput).toBeVisible();
  await FinishMaterialquickSearchInput.fill(testData.Laminate);

  const FinishMaterialCell = estimatePage.locator('td').filter({ hasText: testData.Laminate }).first();
  await expect(FinishMaterialCell).toBeVisible();
  await expect(FinishMaterialCell).toBeEnabled();
  await FinishMaterialCell.click();

  const continueButton_finsh = estimatePage.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton_finsh).toBeEnabled();
  await continueButton_finsh.click();

  const rewinderSlitterInput = estimatePage.locator("xpath=//input[@placeholder='Select a Rewinder/Slitter Class']");
  await rewinderSlitterInput.click();
  const rewinderOption = estimatePage.locator('li[data-label="Rewinder"]');
  await expect(rewinderOption).toBeVisible();
  await expect(rewinderOption).toBeEnabled();
  await rewinderOption.click();

  const numberOfSlitsInput = estimatePage.locator("xpath=//input[@name='deliverableItemWorkflowStepTool.numberOfSlits']");
  await expect(numberOfSlitsInput).toBeVisible();
  await expect(numberOfSlitsInput).toBeEditable();
  await numberOfSlitsInput.fill(testData.numberOfSlits);

  const sheeterInput = estimatePage.locator("xpath=//input[@placeholder='Select a Sheeter Class']");
  await sheeterInput.click();
  const paperCutterOption = estimatePage.locator('li[data-label="Paper Cutter"]');
  await paperCutterOption.click();

  const numberAcrossStepInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.impositionAc']");
  await expect(numberAcrossStepInput).toBeVisible();
  await numberAcrossStepInput.click();
  await numberAcrossStepInput.fill(testData.numberAcrossStep);

  const numberAroundRepeatInput = estimatePage.locator("xpath=//input[@name='deliverableItemSpecification.impositionAr']");
  await expect(numberAroundRepeatInput).toBeVisible();
  await numberAroundRepeatInput.click();
  await numberAroundRepeatInput.fill(testData.numberAroundRepeat);

  const toothCountInput = estimatePage.locator("//input[@name='deliverableItemSpecification.toothCount']");
  await expect(toothCountInput).toBeVisible();
  await toothCountInput.click();
  await toothCountInput.fill(testData.toothCount);

  const coatingMaterialsCheckbox = estimatePage.locator('#inknotrequired-inknotrequired-not-required');
  await coatingMaterialsCheckbox.check();
  await expect(coatingMaterialsCheckbox).toBeChecked();

  const createEstimateButton = estimatePage.getByRole('button', { name: 'Create Estimate', exact: true });
  await expect(createEstimateButton).toBeEnabled();
  await createEstimateButton.click();

  const EstimateSuccessMessage = estimatePage.getByText('Estimate created successfully.', { exact: true });
  await expect(EstimateSuccessMessage).toBeVisible();
  await estimatePage.waitForTimeout(3000);

  const estimateText = await estimatePage.locator('//div[@class="section"]//h1//span').innerText();
  const estimateNumber = estimateText.replace(/\s*-\s*Estimate\s*$/, '').trim();
  console.log(`[data] estimateNumber: ${estimateNumber}`);

  const estimateHeading = estimatePage.locator('span').filter({ hasText: `${estimateNumber} - Estimate` }).first();
  await expect(estimateHeading).toBeVisible();
  await expect(estimateHeading).toContainText(estimateNumber);
  await expect(estimateHeading).toBeEnabled();
  await estimateHeading.click();

  const opportunityLinkDiv = estimatePage.locator('div').filter({ hasText: `Opportunity ${opportunityName}` }).first();
  await expect(opportunityLinkDiv).toBeVisible();
  await expect(opportunityLinkDiv).toBeEnabled();
  await opportunityLinkDiv.click();

  const openLink = estimatePage.locator("//div[normalize-space()='Opportunity']/following-sibling::div//a[.//div[@x-tooltip='Open']]");
  await expect(openLink).toBeVisible();
  await expect(openLink).toBeEnabled();
  await openLink.click();

  const oppBackHeading = estimatePage.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first();
  await expect(oppBackHeading).toBeVisible();
  await expect(oppBackHeading).toBeEnabled();
  await oppBackHeading.click();

  const estimateOnOppDiv = estimatePage.locator('div').filter({ hasText: estimateNumber }).first();
  await expect(estimateOnOppDiv).toBeVisible();
  await expect(estimateOnOppDiv).toBeEnabled();
  await estimateOnOppDiv.click();
  await estimateOnOppDiv.click();
});
