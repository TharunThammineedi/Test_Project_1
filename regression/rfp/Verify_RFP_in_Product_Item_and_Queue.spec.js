// Create RFP from Product Item; verify on Product Item Links and RFP Queue (TC61 / TC62)
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession, saveSession } = require('../../helpers/sessionData');

test('Verify RFP in Product Item and RFP Hub @regression @set2', async ({ page }) => {
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

  const itemsMenuButton = page.locator('button').filter({ hasText: 'Items' }).first();
  await expect(itemsMenuButton).toBeEnabled();
  await itemsMenuButton.click();

  const productItemsLink = page.getByRole('link', { name: 'Product Items', exact: true });
  await expect(productItemsLink).toBeVisible();
  await expect(productItemsLink).toBeEnabled();
  await productItemsLink.click();

  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('main').getByText('Product Items')).toBeVisible();

  await page.waitForTimeout(2000);
  const firstProductItem = page.locator('//tbody//tr[1]//td[2]//p[1]');
  await expect(firstProductItem).toBeVisible();
  const firstProductItemText = (await firstProductItem.textContent()).split('|')[0].trim();

  await firstProductItem.click();

  const newProductItemLink = page.getByRole('link', { name: 'New Product Item', exact: true });
  await expect(newProductItemLink).toBeVisible();

  await page.waitForTimeout(2000);
  const productItemHeading = page.locator('div').filter({ hasText: `${firstProductItemText}-Product Item` }).first();
  await expect(productItemHeading).toBeVisible();

  const customerNameShowpage = page.locator(
    "//span[contains(@class,'text-ellipsis') and contains(@x-tooltip.only-on-ellipsis.allowhtml,'-')]"
  ).first();
  const customerText = (await customerNameShowpage.innerText()).trim();
  const customerNameOnlyShowpage = customerText.split('-').slice(1).join('-').trim();
  console.log("Customer Name:", customerNameOnlyShowpage);

  const descriptionShowpage = page.locator('//div[normalize-space()="Description"]/following-sibling::div//span');
  const descriptionShowpageText = (await descriptionShowpage.innerText()).trim();

  const opportunityShowpage = page.locator(
    '//div[normalize-space()="Opportunity #"]/following-sibling::div//span'
  );
  const opportunityShowpageText = (await opportunityShowpage.innerText()).trim();

  let opportunityName;
  if (opportunityShowpageText === 'Nothing Selected') {
    opportunityName = 'Nothing Selected';
  } else {
    opportunityName = opportunityShowpageText.split('-').slice(1).join('-').trim();
  }
  console.log("Opportunity:", opportunityName);

  const linksTabButton = page.locator('[data-cy="hub-tab-links"]');
  await expect(linksTabButton).toBeVisible();
  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();

  const rfpHeading = page.locator('h3').filter({ hasText: 'Request for Proposal' }).first();
  await expect(rfpHeading).toBeVisible();

  const newRfpLink = page.locator('//h3[normalize-space()="Request for Proposal"]//..//span[normalize-space()="New Request for Proposal"]').first();
  await expect(newRfpLink).toBeVisible();
  await expect(newRfpLink).toBeEnabled();

  const [newRfpPage] = await Promise.all([
    page.context().waitForEvent('page'),
    newRfpLink.click()
  ]);

  await newRfpPage.waitForLoadState('domcontentloaded');
  await newRfpPage.waitForTimeout(3000);

  const newRfpViaProductItem = newRfpPage.locator('//h2[normalize-space()="Request for Proposal Information"]').first();
  await expect(newRfpViaProductItem).toBeVisible();

  if (customerNameOnlyShowpage === '') {
    const selectCustomerButton = newRfpPage.getByRole('button', { name: 'Select Customer', exact: true });
    await expect(selectCustomerButton).toBeEnabled();
    await selectCustomerButton.click();

    const quickSearchInput = newRfpPage.getByPlaceholder('Quick Search').first();
    await expect(quickSearchInput).toBeVisible();
    await expect(quickSearchInput).toBeEditable();
    await quickSearchInput.fill(testData.quickSearch);

    const customerCell = newRfpPage.locator('td').filter({ hasText: 'Charles Lecrec' }).first();
    await expect(customerCell).toBeVisible();
    await expect(customerCell).toBeEnabled();
    await customerCell.click();

    const customerDiv = newRfpPage.locator('div').filter({ hasText: 'Charles Lecrec' }).first();
    await expect(customerDiv).toBeVisible();
    await expect(customerDiv).toBeEnabled();
    await customerDiv.click();

    const unlinkButton = newRfpPage.getByRole('button', { name: 'Unlink', exact: true });
    await expect(unlinkButton).toBeVisible();

    const continueCustomerButton = newRfpPage.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueCustomerButton).toBeEnabled();
    await continueCustomerButton.click();
  } else {
    const customerName = newRfpPage.locator(
      '//div[contains(@class,"pt-1")][.//div[normalize-space()="Customer"]]//div[contains(@class,"uppercase")]'
    ).first();
    const customerNameText = (await customerName.innerText()).trim();
    console.log("Customer:", customerNameText);
    expect(customerNameText.toLowerCase()).toBe(customerNameOnlyShowpage.toLowerCase());
  }

  if (opportunityName === 'Nothing Selected') {
    const chooseOpportunityButton = newRfpPage.locator('//button[normalize-space()="Choose Opportunity"]').first();
    await expect(chooseOpportunityButton).toBeVisible();
    await chooseOpportunityButton.click();

    const opportunityQuickSearchInput = newRfpPage.getByPlaceholder('Quick Search');
    await opportunityQuickSearchInput.click();
    await opportunityQuickSearchInput.fill(testData.otp);

    const opportunityCell = newRfpPage.locator('td').filter({ hasText: testData.otp }).first();
    await expect(opportunityCell).toBeVisible();
    await expect(opportunityCell).toBeEnabled();
    await opportunityCell.click();

    const continueButton3 = newRfpPage.getByRole('button', {
      name: 'Continue',
      exact: true
    });
    await continueButton3.click();

    const opportunityNameCreationPage = newRfpPage.locator(
      '//div[normalize-space()="Opportunity"]/following-sibling::div//div[contains(@class,"uppercase")]'
    ).first();
    const opportunityNameTextCreationPage = (await opportunityNameCreationPage.innerText()).trim();
    expect(opportunityNameTextCreationPage.toLowerCase()).toBe(testData.otp.toLowerCase());
  } else {
    const opportunityNameCreationPage = newRfpPage.locator(
      '//div[normalize-space()="Opportunity"]/following-sibling::div//div[contains(@class,"uppercase")]'
    ).first();
    const opportunityNameTextCreationPage = (await opportunityNameCreationPage.innerText()).trim();
    expect(opportunityNameTextCreationPage.toLowerCase()).toBe(opportunityName.toLowerCase());
  }

  const pricingTablePresetsFieldset = newRfpPage.locator('fieldset').filter({ hasText: 'Pricing Table Presets' }).first();
  await expect(pricingTablePresetsFieldset).toBeVisible();
  await expect(pricingTablePresetsFieldset).toBeEnabled();
  await pricingTablePresetsFieldset.click();

  const salesUnitInput = newRfpPage.locator('//input[contains(@name,"quantityUnitId")]');
  await expect(salesUnitInput).toBeVisible();
  await expect(salesUnitInput).toBeEnabled();
  await salesUnitInput.click();
  const feetOption = newRfpPage.locator('li[data-label="Feet"]');
  await expect(feetOption).toBeVisible();
  await expect(feetOption).toBeEnabled();
  await feetOption.click();

  const quantityBreak1Input = newRfpPage.locator('input[name="deliverableItemDTO.extension.quantityBreak1"][type="text"]');
  await expect(quantityBreak1Input).toBeVisible();
  await expect(quantityBreak1Input).toBeEditable();
  await quantityBreak1Input.fill(testData.quantityBreak1);

  const quotingOptionsFieldset = newRfpPage.locator('fieldset').filter({ hasText: 'Quoting Options' }).first();
  await expect(quotingOptionsFieldset).toBeVisible();
  await expect(quotingOptionsFieldset).toBeEnabled();
  await quotingOptionsFieldset.click();

  const maxColorsInput = newRfpPage.locator('input[name="deliverableItemDTO.extension.maxColorsToQuote"][type="text"]');
  await expect(maxColorsInput).toBeVisible();
  await expect(maxColorsInput).toBeEnabled();
  await maxColorsInput.click();
  const sixColorsOption = newRfpPage.locator('li[data-label="2"]');
  if (!(await sixColorsOption.isVisible())) {
    await maxColorsInput.click();
  }
  await expect(sixColorsOption).toBeVisible();
  await expect(sixColorsOption).toBeEnabled();
  await sixColorsOption.click();

  const generalInfoDiv = newRfpPage.locator('div').filter({ hasText: 'General Information' }).first();
  await expect(generalInfoDiv).toBeVisible();
  await expect(generalInfoDiv).toBeEnabled();
  await generalInfoDiv.click();

  const productClassInput = newRfpPage.locator(
    'input[name="deliverableItemDTO.productClassId"][type="text"]'
  );
  await expect(productClassInput).toBeVisible();
  await expect(productClassInput).toBeEnabled();
  const currentProductClass = (await productClassInput.inputValue()).trim();
  console.log("Current Product Class:", currentProductClass);
  if (currentProductClass !== "RFID Label") {
    await productClassInput.click();
    const rfidLabelOption = newRfpPage.locator('li[data-label="RFID Label"]');
    await expect(rfidLabelOption).toBeVisible();
    await expect(rfidLabelOption).toBeEnabled();
    await rfidLabelOption.click();
  }

  const workflowInput = newRfpPage.locator('input[name="deliverableItemSpecification.workflowId"][type="text"]');
  await expect(workflowInput).toBeVisible();
  await expect(workflowInput).toBeEnabled();
  await workflowInput.click();
  const rfidWorkflowOption = newRfpPage.locator('li[data-label="RFID Digital Workflow"]');
  await expect(rfidWorkflowOption).toBeVisible();
  await expect(rfidWorkflowOption).toBeEnabled();
  await rfidWorkflowOption.click();

  const plantInput = newRfpPage.locator('input[name="deliverableItemSpecification.plantId"][type="text"]');
  await expect(plantInput).toBeVisible();
  await expect(plantInput).toBeEnabled();
  await plantInput.click();
  const fortisOption = newRfpPage.locator('li[data-label="Fortis (99)"]');
  await expect(fortisOption).toBeVisible();
  await expect(fortisOption).toBeEnabled();
  await fortisOption.click();

  const descriptionInput = newRfpPage.locator(
    '//label[@for="deliverableItemDTO.description"]/following-sibling::div/textarea'
  );
  await expect(descriptionInput).toBeVisible();
  const descriptionText = (await descriptionInput.inputValue()).trim();
  expect(descriptionText).toBe(descriptionShowpageText);

  const unitSetInput = newRfpPage.locator('input[name="deliverableItemSpecification.unitSetTypeId"][type="text"]');
  await expect(unitSetInput).toBeVisible();
  await expect(unitSetInput).toBeEnabled();
  await unitSetInput.click();
  const rollOption = newRfpPage.locator('li[data-label="Rolls/Boxed"]');
  await expect(rollOption).toBeVisible();
  await expect(rollOption).toBeEnabled();
  await rollOption.click();

  const coreDiameterInput = newRfpPage.locator('input[name="deliverableItemSpecification.coreDiameterId"][type="text"]');
  await expect(coreDiameterInput).toBeVisible();
  await expect(coreDiameterInput).toBeEnabled();
  await coreDiameterInput.click();
  const oneInchOption = newRfpPage.locator('(//li[@data-label="1"])[2]');
  await expect(oneInchOption).toBeVisible();
  await expect(oneInchOption).toBeEnabled();
  await oneInchOption.click();

  const applicationTempInput = newRfpPage.locator('input[name="deliverableItemSpecification.applicationTemp"][type="text"]');
  await expect(applicationTempInput).toBeVisible();
  await expect(applicationTempInput).toBeEditable();
  await applicationTempInput.fill(testData.applicationTempRequired);

  const surfaceTypeInput = newRfpPage.locator('input[name="deliverableItemSpecification.applicationSurfaceTypeValuelistOptionId"][type="text"]');
  await expect(surfaceTypeInput).toBeVisible();
  await expect(surfaceTypeInput).toBeEnabled();
  await surfaceTypeInput.click();
  const glassOption = newRfpPage.locator('li[data-label="Glass"]');
  await expect(glassOption).toBeVisible();
  await expect(glassOption).toBeEnabled();
  await glassOption.click();

  const surfaceTempAfterInput = newRfpPage.locator('input[name="deliverableItemSpecification.surfaceTempAfterApplication"][type="text"]');
  await expect(surfaceTempAfterInput).toBeVisible();
  await expect(surfaceTempAfterInput).toBeEditable();
  await surfaceTempAfterInput.fill(testData.surfaceTempAfter);

  const substrateInfoFieldset = newRfpPage.locator('fieldset').filter({ hasText: 'Generic Substrate Information' }).first();
  await expect(substrateInfoFieldset).toBeVisible();
  await expect(substrateInfoFieldset).toBeEnabled();
  await substrateInfoFieldset.click();

  const appearanceColorInput = newRfpPage.locator('input[name="deliverableItemSpecification.substrateColor"][type="text"]');
  await expect(appearanceColorInput).toBeVisible();
  await expect(appearanceColorInput).toBeEditable();
  await appearanceColorInput.fill(testData.appearanceColorRequired);

  const substrateFaceInput = newRfpPage.locator('input[name="deliverableItemSpecification.substrateFace"][type="text"]');
  await expect(substrateFaceInput).toBeVisible();
  await expect(substrateFaceInput).toBeEditable();
  await substrateFaceInput.fill(testData.substrateFaceOrFacestock);

  const adhesiveInput = newRfpPage.locator('input[name="deliverableItemSpecification.substrateAdhesive"][type="text"]');
  await expect(adhesiveInput).toBeVisible();
  await expect(adhesiveInput).toBeEditable();
  await adhesiveInput.fill(testData.adhesiveRequired);

  const linerInput = newRfpPage.locator('input[name="deliverableItemSpecification.substrateLiner"][type="text"]');
  await expect(linerInput).toBeVisible();
  await expect(linerInput).toBeEditable();
  await linerInput.fill(testData.adhesiveRequired);

  const coatingInput = newRfpPage.locator('input[name="deliverableItemSpecification.coatingTypeValuelistOptionId"][type="text"]');
  await expect(coatingInput).toBeVisible();
  await expect(coatingInput).toBeEnabled();
  await coatingInput.click();
  const uvGlossOption = newRfpPage.locator('li[data-label="UV Gloss"]');
  await expect(uvGlossOption).toBeVisible();
  await expect(uvGlossOption).toBeEnabled();
  await uvGlossOption.click();

  const laminateInput = newRfpPage.locator('input[name="deliverableItemSpecification.laminateTypeValuelistOptionId"][type="text"]');
  await expect(laminateInput).toBeVisible();
  await expect(laminateInput).toBeEnabled();
  await laminateInput.click();
  const ulLaminateOption = newRfpPage.locator('li[data-label="UL Laminate"]');
  await expect(ulLaminateOption).toBeVisible();
  await expect(ulLaminateOption).toBeEnabled();
  await ulLaminateOption.click();

  const windDirectionInput = newRfpPage.locator('input[name="deliverableItemSpecification.windDirectionId"][type="text"]');
  await expect(windDirectionInput).toBeVisible();
  await expect(windDirectionInput).toBeEnabled();
  await windDirectionInput.click();
  const leftFirstOption = newRfpPage.locator('li[data-label="4 - Print out, Left first."]');
  await expect(leftFirstOption).toBeVisible();
  await expect(leftFirstOption).toBeEnabled();
  await leftFirstOption.click();

  const chooseUnitTemplatesButton = newRfpPage.getByRole('button', { name: 'Choose Unit Templates', exact: true });
  await expect(chooseUnitTemplatesButton).toBeEnabled();
  await chooseUnitTemplatesButton.click();

  const unitTemplateQuickSearchInput = newRfpPage.locator('input[placeholder="Quick Search"][data-flux-control]');
  await unitTemplateQuickSearchInput.fill(testData.unitTemplatePicker);

  const utm12991Div = newRfpPage.locator('div').filter({ hasText: 'UTM12991' }).first();
  await expect(utm12991Div).toBeVisible();
  await utm12991Div.click();

  const continueButton4 = newRfpPage.locator('//h3[normalize-space()="Choose Unit-Template-Picker"]//ancestor::div[4]//span[normalize-space()="Continue"]');
  await continueButton4.click();

  const createRfpButton = newRfpPage.getByRole('button', {
    name: 'Create Request for Proposal',
    exact: true
  });
  await expect(createRfpButton).toBeEnabled();
  await createRfpButton.click();

  const rfpSuccessMessage = newRfpPage.getByText('Request for Proposal created successfully.', { exact: true });
  await expect(rfpSuccessMessage).toBeVisible();

  await newRfpPage.waitForTimeout(2000);
  const rfpText = await newRfpPage.locator(
    '//h1/span[contains(normalize-space(), "Request for Proposal")]'
  ).innerText();
  const rfpNumber = rfpText.split('-')[0].trim();
  saveSession({ rfpNumber });
  console.log(`[data] Saved RFP Id → ${rfpNumber}`);

  const draftIcon = newRfpPage.locator('//span[normalize-space()="Draft"]/preceding-sibling::div/span/span[normalize-space()="01"]');
  await expect(draftIcon).toHaveCount(0);

  await newRfpPage.close();
  await page.reload();

  const createdRfpNumber = page.locator(
    `//h3[normalize-space()="Request for Proposal"]/../following::div[contains(@class,"text-ellipsis") and normalize-space()="${rfpNumber}"]`
  );
  await expect(createdRfpNumber).toBeVisible();
  await expect(createdRfpNumber).toHaveCount(1);

  const estimateMenuLinkBack = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
  await expect(estimateMenuLinkBack).toBeVisible();
  await estimateMenuLinkBack.click();

  const rfpMenuLinkBack = page.getByRole('link', { name: 'Request For Proposals', exact: true });
  await expect(rfpMenuLinkBack).toBeVisible();
  await expect(rfpMenuLinkBack).toBeEnabled();
  await rfpMenuLinkBack.click();

  const rfpQueueLabel = page
    .locator('label')
    .filter({ hasText: /^Request for Proposals Queue$/ })
    .first();
  await expect(rfpQueueLabel).toBeVisible();
  await expect(rfpQueueLabel).toBeEnabled();

  const rfpQuickSearchInput = page.locator('input[placeholder="Quick Search"][data-flux-control]');
  await expect(rfpQuickSearchInput).toBeEnabled();
  await rfpQuickSearchInput.click();
  await rfpQuickSearchInput.fill(rfpNumber);

  const rfpCell = page.locator('td').filter({ hasText: rfpNumber }).first();
  await expect(rfpCell).toBeVisible();
  await expect(rfpCell).toHaveText(rfpNumber);

  await expect(page.locator('//tbody/tr')).toHaveCount(1);
});
