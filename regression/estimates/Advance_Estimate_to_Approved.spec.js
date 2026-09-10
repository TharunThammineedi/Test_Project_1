// Advance Estimate to Approved
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Advance Estimate to Approved @regression @set1', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  // Initial navigation and login
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

// Dashboard navigation
const taskDashboardLabel = page
  .locator('label')
  .filter({ hasText: /^Ranga\'s Task Dashboard$/ })
  .first();

await expect(taskDashboardLabel).toBeVisible();
await expect(taskDashboardLabel).toBeEnabled();

const btn = page.locator(
  '(//button[normalize-space()="Estimating & Pricing"])[1]'
);
await btn.click();


const estimatesQuotesLink = page.getByRole('link', {
    name: 'Estimates/Quotes',
    exact: true
  });
  await expect(estimatesQuotesLink).toBeVisible();
  await expect(estimatesQuotesLink).toBeEnabled();
  await estimatesQuotesLink.click();

  const estimatesQuotesIndexpage = page
  .locator('label')
  .filter({ hasText: 'Estimates/Quotes' })
  .first();

await expect(estimatesQuotesIndexpage).toBeVisible();
await expect(estimatesQuotesIndexpage).toBeEnabled();
await estimatesQuotesIndexpage.click();

await page.waitForLoadState('domcontentloaded');

const newEstimateLink = page.getByRole('link', { name: 'New Estimate', exact: true });
await expect(newEstimateLink).toBeVisible();
await expect(newEstimateLink).toBeEnabled();
await newEstimateLink.click();

const EstimateCreationPage_header = page.locator('//h2[normalize-space()="Estimate Information"]');
await expect(EstimateCreationPage_header).toBeVisible();

const selectCustomerButton = page.getByRole('button', {
    name: 'Select Customer',
    exact: true
  });

  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  const customerQuickSearchInput = page.locator("xpath=//div[normalize-space(.)='Filters 0 Filters Reset Add a filter Apply']/preceding::input[@placeholder='Quick Search']");

  await expect(customerQuickSearchInput).toBeEnabled();
  await customerQuickSearchInput.click();
  await customerQuickSearchInput.fill(testData.quickSearch);

  const customerResult = page
    .locator('div')
    .filter({ hasText: testData.quickSearch })
    .first();

  await expect(customerResult).toBeVisible();
  await expect(customerResult).toBeEnabled();
  await customerResult.click();

  const customerRadio = page.locator(
    'input[name="datagrid-radio-selection"][type="radio"]'
  );

  await customerRadio.check();
  await expect(customerRadio).toBeChecked();

  // Continue after customer selection
  const continueButton1 = page.getByRole('button', {
    name: 'Continue',
    exact: true
  });

  await expect(continueButton1).toBeEnabled();
  await continueButton1.click();

  // Choose Opportunity
  const chooseOpportunityButton = page.getByRole('button', {
    name: 'Choose Opportunity',
    exact: true
  });

  await expect(chooseOpportunityButton).toBeEnabled();
  await chooseOpportunityButton.click();

  const opportunityQuickSearchInput = page.locator("xpath=//div[@id='project-picker-picker-opportunity-picker']//input[@placeholder='Quick Search']");

  await opportunityQuickSearchInput.click();

  const opportunityCell = page.locator("xpath=//div[@id='project-picker-picker-opportunity-picker']//tbody//tr[1]//td[2]");

  await expect(opportunityCell).toBeVisible();
  await expect(opportunityCell).toBeEnabled();
  await opportunityCell.click();

  // Continue after opportunity selection
  const continueButton3 = page.getByRole('button', {
    name: 'Continue',
    exact: true
  });

  await continueButton3.click();

  // Estimate quantity unit
  const quantityUnitInput = page.locator("xpath=//input[@name='deliverableItemDTO.extension.quantityUnitId']");

  await expect(quantityUnitInput).toBeEnabled();
  await quantityUnitInput.click();

  const metersOption = page.locator('li[data-label="Meters"]');

  await expect(metersOption).toBeEnabled();
  await metersOption.click();

  // Quantity break 1
  const quantityBreakInput = page.locator("xpath=//input[@name='deliverableItemDTO.extension.quantityBreak1']");

  await expect(quantityBreakInput).toBeEnabled();
await quantityBreakInput.click();
await quantityBreakInput.fill(testData.quantityBreak1);

// Max colors to quote
const maxColorsInput = page.locator("xpath=//input[@name='deliverableItemDTO.extension.maxColorsToQuote']");

await expect(maxColorsInput).toBeEnabled();
await maxColorsInput.click();

const colorsOption = page.locator('li[data-label="2"]');

await expect(colorsOption).toBeEnabled();
await colorsOption.click();

// Product class
const productClassInput = page.locator("xpath=//input[@name='deliverableItemDTO.productClassId']");

await expect(productClassInput).toBeEnabled();
await productClassInput.click();

const primeLabelOption = page.locator(
  'li[data-label="Prime Label"]'
);

await expect(primeLabelOption).toBeEnabled();
await expect(primeLabelOption).toBeVisible();
await primeLabelOption.click();

await expect(productClassInput).toHaveValue('Prime Label');

// Workflow
const workflowInput = page.locator("xpath=//input[@name='deliverableItemSpecification.workflowId']");

await expect(workflowInput).toBeEnabled();
await workflowInput.click();

const standardDigitalLabelOption = page.locator(
  'li[data-label="Standard Digital Label"]'
);

await expect(standardDigitalLabelOption).toBeEnabled();
await standardDigitalLabelOption.click();

// Plant
const plantInput = page.locator("xpath=//input[@name='deliverableItemSpecification.plantId']");

await expect(plantInput).toBeEnabled();
await plantInput.click();

const fortisOption = page.locator(
  'li[data-label="Fortis (99)"]'
);

await expect(fortisOption).toBeEnabled();
await fortisOption.click();

// Description
const descriptionInput = page.locator("xpath=//textarea[@id='deliverableItemDTO.description']");

await descriptionInput.fill(testData.descriptionRequired);

// Unit set
const unitSetInput = page.locator("xpath=//input[@name='deliverableItemSpecification.unitSetTypeId']");

await expect(unitSetInput).toBeEnabled();
await unitSetInput.click();

const rollsBoxedOption = page.locator(
  'li[data-label="Rolls/Boxed"]'
);

await expect(rollsBoxedOption).toBeEnabled();
await rollsBoxedOption.click();

// Core diameter
const coreDiameterInput = page.locator("xpath=//input[@name='deliverableItemSpecification.coreDiameterId']");

await expect(coreDiameterInput).toBeEnabled();
await coreDiameterInput.click();

const coreDiameterOption = page.locator(
  '(//li[@data-label="1"])[2]'
);

await coreDiameterOption.click();

// Application type
const applicationTypeInput = page.locator("xpath=//input[@name='deliverableItemSpecification.applicationType']");

await expect(applicationTypeInput).toBeEnabled();
await applicationTypeInput.click();

const handOption = page.locator('li[data-label="Hand"]');

await expect(handOption).toBeEnabled();
await handOption.click();

// Application temp
const applicationTempInput = page.locator("xpath=//input[@name='deliverableItemSpecification.applicationTemp']");

await expect(applicationTempInput).toBeEditable();
await applicationTempInput.fill(testData.applicationTempRequired);

// Surface type
const surfaceTypeInput = page.locator("xpath=//input[@name='deliverableItemSpecification.applicationSurfaceTypeValuelistOptionId']");

await expect(surfaceTypeInput).toBeEnabled();
await surfaceTypeInput.click();

const petgOption = page.locator('li[data-label="PETg"]');

await expect(petgOption).toBeEnabled();
await petgOption.click();

// Surface temp after application
const surfaceTempAfterInput = page.locator("xpath=//input[@name='deliverableItemSpecification.surfaceTempAfterApplication']");

await expect(surfaceTempAfterInput).toBeEditable();
await surfaceTempAfterInput.fill(testData.surfaceTempAfter);

// Appearance color
const appearanceColorInput = page.locator("xpath=//input[@name='deliverableItemSpecification.substrateColor']");

await expect(appearanceColorInput).toBeEditable();
await appearanceColorInput.fill(testData.appearanceColorRequired);

// Substrate face/facestock
const substrateFaceInput = page.locator("xpath=//input[@name='deliverableItemSpecification.substrateFace']");

await expect(substrateFaceInput).toBeEditable();
await substrateFaceInput.fill(testData.substrateFaceOrFacestock);

// Adhesive
const adhesiveInput = page.locator("xpath=//input[@name='deliverableItemSpecification.substrateAdhesive']");

await expect(adhesiveInput).toBeEditable();
await adhesiveInput.fill(testData.adhesiveRequired);

// Liner
const linerInput = page.locator("xpath=//input[@name='deliverableItemSpecification.substrateLiner']");

await expect(linerInput).toBeEditable();
await linerInput.fill(testData.linerRequired);

const coating= page.locator("xpath=//input[@name='deliverableItemSpecification.coatingTypeValuelistOptionId']");
await expect(coating).toBeEnabled();
await coating.click();

const coatingOption = page.locator('li[data-label="UV Matte"]');
await expect(coatingOption).toBeEnabled();
await coatingOption.click();
await expect(coating).toHaveValue('UV Matte');

const laminate= page.locator("xpath=//input[@name='deliverableItemSpecification.laminateTypeValuelistOptionId']");
await expect(laminate).toBeEnabled();
await laminate.click();

const laminateOption = page.locator('li[data-label="Gloss Laminate"]');
await expect(laminateOption).toBeEnabled();
await laminateOption.click();
await expect(laminate).toHaveValue('Gloss Laminate');

// Wind direction
const windDirectionButton = page.getByRole('button', {
  name: '7 - Print in, Right first.',
  exact: true
});

await expect(windDirectionButton).toBeEnabled();
await windDirectionButton.click();

// Choose Unit Templates
const chooseUnitTemplatesButton = page.getByRole('button', {
  name: 'Choose Unit Templates',
  exact: true
});

await expect(chooseUnitTemplatesButton).toBeEnabled();
await chooseUnitTemplatesButton.click();

// Unit template quick search
const unitTemplateQuickSearchInput = page.locator("xpath=//div[@id='unit-template-picker-picker-unit-template-picker-unit-template-component-pc-2']//input[@placeholder='Quick Search']");

await unitTemplateQuickSearchInput.fill(
  testData.unitTemplatePicker
);

const unitTemplateResult = page
  .locator('div')
  .filter({ hasText: testData.unitTemplatePicker })
  .first();

await expect(unitTemplateResult).toBeVisible();
await expect(unitTemplateResult).toBeEnabled();
await unitTemplateResult.click();

// Continue after unit template selection
const continueButton4 = page.locator(
  '//h3[normalize-space()="Choose Unit-Template-Picker"]' +
  '//ancestor::div[4]//span[normalize-space()="Continue"]'
);

await continueButton4.click();

const chooseMaterialItemButton = page.getByRole('button', { name: 'Choose Material Item', exact: true }).first();
  await expect(chooseMaterialItemButton).toBeEnabled();
  await chooseMaterialItemButton.click();

    // Confirm modal heading
    await expect(page.locator('h3').filter({ hasText: /^Choose Material Item$/ }).first()).toBeVisible();

      // --- Quick Search for Material Item 1 ---
  const MaterialItemquickSearchInput = page.locator("xpath=//input[contains(concat(' ', normalize-space(@class), ' '), ' ps-10 ') and @type='text']");
  await expect(MaterialItemquickSearchInput).toBeVisible();
  await expect(MaterialItemquickSearchInput).toBeEditable();
  await MaterialItemquickSearchInput.fill(testData.MaterialItemquickSearch);

   // Confirm result cell is visible
   const firstMaterialCell = page.locator('td').filter({ hasText: testData.MaterialItemquickSearch }).first();
   await expect(firstMaterialCell).toBeVisible();
   await expect(firstMaterialCell).toBeEnabled();
   await firstMaterialCell.click();

     // Confirm Unlink button is visible
  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();

  // Continue after selecting material
  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

    const chooseMaterialItemButton_laminate = page.getByRole('button', { name: 'Choose Material Item', exact: true }).first();
  await expect(chooseMaterialItemButton_laminate).toBeEnabled();
  await chooseMaterialItemButton_laminate.click();

    // --- Quick Search for Material Item 2 ---
    const FinishMaterialquickSearchInput = page.locator("xpath=//div[normalize-space(.)='Choose Material Item']/following::input[@placeholder='Quick Search']");
    await expect(FinishMaterialquickSearchInput).toBeVisible();
    await FinishMaterialquickSearchInput.fill(testData.Laminate);

    const FinishMaterialCell = page.locator('td').filter({ hasText: testData.Laminate }).first();
    await expect(FinishMaterialCell).toBeVisible();
    await expect(FinishMaterialCell).toBeEnabled();
    await FinishMaterialCell.click();

    const continueButton_finsh = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueButton_finsh).toBeEnabled();
    await continueButton_finsh.click();

    // --- Select Rewinder/Slitter ---
    const rewinderSlitterInput = page.locator("xpath=//input[@placeholder='Select a Rewinder/Slitter Class']");
    await rewinderSlitterInput.click();

    const rewinderOption = page.locator('li[data-label="Rewinder"]');
    await expect(rewinderOption).toBeVisible();
    await expect(rewinderOption).toBeEnabled();
    await rewinderOption.click();

      // --- Enter number of slits ---
    const numberOfSlitsInput = page.locator("xpath=//input[@name='deliverableItemWorkflowStepTool.numberOfSlits']");
    await expect(numberOfSlitsInput).toBeVisible();
    await expect(numberOfSlitsInput).toBeEditable();
    await numberOfSlitsInput.fill(testData.numberOfSlits);

     // --- Select Sheeter ---
    const sheeterInput = page.locator("xpath=//input[@placeholder='Select a Sheeter Class']");
    await sheeterInput.click();

    const paperCutterOption = page.locator('li[data-label="Paper Cutter"]');
    await paperCutterOption.click();

    // --- Enter step across (imposition across) ---
    const numberAcrossStepInput = page.locator("xpath=//input[@name='deliverableItemSpecification.impositionAc']");
    await expect(numberAcrossStepInput).toBeVisible();
    await numberAcrossStepInput.click();
    await numberAcrossStepInput.fill(testData.numberAcrossStep);

      // --- Enter repeat around (imposition around) ---
      const numberAroundRepeatInput = page.locator("xpath=//input[@name='deliverableItemSpecification.impositionAr']");
      await expect(numberAroundRepeatInput).toBeVisible();
      await numberAroundRepeatInput.click();
      await numberAroundRepeatInput.fill(testData.numberAroundRepeat);

      // --- Enter tooth count ---
      const toothCountInput = page.locator("//input[@name='deliverableItemSpecification.toothCount']");
      await expect(toothCountInput).toBeVisible();
      await toothCountInput.click();
      await toothCountInput.fill(testData.toothCount);

      const coatingMaterialsCheckbox = page.locator(
        '#inknotrequired-inknotrequired-not-required'
      );
      await coatingMaterialsCheckbox.check();
      await expect(coatingMaterialsCheckbox).toBeChecked();

  // --- Create Estimate (first click) ---
  const createEstimateButton = page.getByRole('button', { name: 'Create Estimate', exact: true });
  await expect(createEstimateButton).toBeEnabled();
  await createEstimateButton.click();

const EstimateSuccessMessage =  page.getByText(
  'Estimate created successfully.',
  { exact: true }
);
await expect(EstimateSuccessMessage).toBeVisible();
await page.waitForTimeout(3000);

const estimateText = await page.locator('//div[@class="section"]//h1//span').innerText();
const estimateNumber = estimateText.replace(/\s*-\s*Estimate\s*$/, '').trim();
console.log("Estimate Number:", estimateNumber);

const draftIcon = page.locator(
    '//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]');
  await expect(draftIcon).not.toBeVisible();
  await expect(draftIcon).toHaveCount(0);

  const statusDraftDiv = page.locator('div').filter({ hasText: 'Needs Approval' }).first();
  await expect(statusDraftDiv).toBeVisible(); 

  
  const advanceToApprovedButton = page.locator('//button//p[normalize-space()="Advance to APPROVED"]');
  await expect(advanceToApprovedButton).toBeEnabled();
  await advanceToApprovedButton.click();

  
  const advanceToApprovedHeading = page.locator('#modal-headline');
  await expect(advanceToApprovedHeading).toBeVisible();
 
  const confirmButton = page.locator('[data-cy="confirm"]');
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  const estimateAdvancedMessage = page.locator('p').filter({ hasText: 'The estimate has been advanced to APPROVED.' }).first();
  await expect(estimateAdvancedMessage).toBeVisible();

  const statusApprovedSpan = page.locator('//span[normalize-space()="Approved"]/preceding-sibling::div/span/span[normalize-space()="04"]');
  await expect(statusApprovedSpan).toBeVisible();

  const statusApprovedDiv = page.locator('div').filter({ hasText: 'Status Approved' }).first();

  const btn_backToEstimatingPricing = page.locator(
    '(//button[normalize-space()="Estimating & Pricing"])[1]'
  );
  await btn_backToEstimatingPricing.click();
  
  const estimatesQuotesLink_backToEstimatingPricing = page.getByRole('link', {
      name: 'Estimates/Quotes',
      exact: true
    });
    await expect(estimatesQuotesLink_backToEstimatingPricing).toBeVisible();
    await expect(estimatesQuotesLink_backToEstimatingPricing).toBeEnabled();
    await estimatesQuotesLink_backToEstimatingPricing.click();
  
    const estimatesQuotesIndexpage_backToEstimatingPricing = page
    .locator('label')
    .filter({ hasText: 'Estimates/Quotes' })
    .first();
  
  await expect(estimatesQuotesIndexpage_backToEstimatingPricing).toBeVisible();
  await expect(estimatesQuotesIndexpage_backToEstimatingPricing).toBeEnabled();
  await estimatesQuotesIndexpage_backToEstimatingPricing.click();
 
  const estimatesQuickSearchInput = page.locator('[placeholder="Quick Search"]').first();
  await expect(estimatesQuickSearchInput).toBeVisible();
  await expect(estimatesQuickSearchInput).toBeEditable();
  await estimatesQuickSearchInput.fill(estimateNumber);

  const estRow = page.locator('td').filter({ hasText: estimateNumber }).first();
  await expect(estRow).toBeVisible();
  await expect(estRow).toBeEnabled();
 
  const approvedCell = page.locator('td').filter({ hasText: 'Approved' }).first();
  await expect(approvedCell).toBeVisible();

  const estRowCount =await page.locator('//th[normalize-space()="Customer"]//following::tbody//tr//td[2]').count();
  await expect(estRowCount).toBe(1);
}); 