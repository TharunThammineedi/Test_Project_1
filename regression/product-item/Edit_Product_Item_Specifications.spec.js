// Create a Product Item, then edit production specifications on that record
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Edit Product Item Specifications @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → appearanceColorRequired: ${session.appearanceColorRequired}`);

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

  const newProductItemLink = page.getByRole('link', {
    name: 'New Product Item',
    exact: true
  });
  await expect(newProductItemLink).toBeVisible();
  await expect(newProductItemLink).toBeEnabled();
  await newProductItemLink.click();

  const newProductItemText = page.locator('//label[normalize-space()="New Product Item"]').first();
  await expect(newProductItemText).toBeVisible();
  await expect(newProductItemText).toBeEnabled();

  const selectCustomerButton = page.getByRole('button', {
    name: 'Select Customer',
    exact: true
  });
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  const customerQuickSearchInput = page.getByPlaceholder('Quick Search').first();
  await expect(customerQuickSearchInput).toBeEnabled();
  await customerQuickSearchInput.click();
  await customerQuickSearchInput.fill(testData.quickSearch);

  const customerCell = page.locator('td').filter({ hasText: testData.quickSearch }).first();
  await expect(customerCell).toBeVisible();
  await expect(customerCell).toBeEnabled();
  await customerCell.click();
  await page.waitForTimeout(2000);

  const continueProductItemButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueProductItemButton).toBeEnabled();
  await continueProductItemButton.click();

  const productClassInput = page.locator('input[name="deliverableItem.product_class_id"][type="text"]');
  await expect(productClassInput).toBeVisible();
  await expect(productClassInput).toBeEnabled();
  await productClassInput.click();

  const primeLabelOption = page.locator('li[data-label="Prime Label"]');
  await expect(primeLabelOption).toBeVisible();
  await expect(primeLabelOption).toBeEnabled();
  await primeLabelOption.click();

  const customerPartNumberInput = page.locator('input[name="productItemExtension.customer_part_number"][type="text"]');
  await expect(customerPartNumberInput).toBeVisible();
  await expect(customerPartNumberInput).toBeEditable();
  await customerPartNumberInput.fill(testData.customerPartNumberRequired);

  const brandNameInput = page.locator('input[name="productItemExtension.brand_name"][type="text"]');
  await expect(brandNameInput).toBeVisible();
  await expect(brandNameInput).toBeEditable();
  await brandNameInput.fill(testData.brandName);

  const maxODInput = page.locator('input[name="specification.max_roll_diameter"][type="number"]');
  await expect(maxODInput).toBeVisible();
  await expect(maxODInput).toBeEditable();
  await maxODInput.fill(testData.editingAncillaryItemsQuantity);

  const substrateInput = page.locator('input[name="productItemExtension.substrate_text"][type="text"]');
  await expect(substrateInput).toBeVisible();
  await expect(substrateInput).toBeEditable();
  await substrateInput.fill(testData.substrateFaceOrFacestock);

  const coatingInput = page.locator('input[name="specification.coating_type_valuelist_option_id"][type="text"]');
  await expect(coatingInput).toBeVisible();
  await expect(coatingInput).toBeEnabled();
  await coatingInput.click();

  const uvMatteOption = page.locator('li[data-label="UV Matte"]');
  await expect(uvMatteOption).toBeVisible();
  await expect(uvMatteOption).toBeEnabled();
  await uvMatteOption.click();

  const coreDiameterInput = page.locator('input[name="specification.core_diameter_id"][type="text"]');
  await expect(coreDiameterInput).toBeVisible();
  await expect(coreDiameterInput).toBeEnabled();
  await coreDiameterInput.click();

  const coreDiameterOption = page.locator('li[data-label="1"]');
  await expect(coreDiameterOption).toBeVisible();
  await expect(coreDiameterOption).toBeEnabled();
  await coreDiameterOption.click();

  const unwindInput = page.locator('input[name="specification.wind_direction_id"][type="text"]');
  await expect(unwindInput).toBeVisible();
  await expect(unwindInput).toBeEnabled();
  await unwindInput.click();

  const unwindOption = page.locator('li[data-label="3 - Print out, Right first."]');
  await expect(unwindOption).toBeVisible();
  await expect(unwindOption).toBeEnabled();
  await unwindOption.click();

  const laminateInput = page.locator('input[name="specification.laminate_type_valuelist_option_id"][type="text"]');
  await expect(laminateInput).toBeVisible();
  await expect(laminateInput).toBeEnabled();
  await laminateInput.click();

  const glossLaminateOption = page.locator('li[data-label="Gloss Laminate"]');
  await expect(glossLaminateOption).toBeVisible();
  await expect(glossLaminateOption).toBeEnabled();
  await glossLaminateOption.click();

  const salesUnitInput = page.locator('input[name="item.sales_unit_id"][type="text"]');
  await expect(salesUnitInput).toBeVisible();
  await expect(salesUnitInput).toBeEnabled();
  await salesUnitInput.click();

  const feetOption = page.locator('li[data-label="Feet"]');
  await expect(feetOption).toBeVisible();
  await expect(feetOption).toBeEnabled();
  await feetOption.click();

  const quantityInput = page.locator('input[name="item.quantity_in_sales_uom"][type="number"]');
  await expect(quantityInput).toBeVisible();
  await expect(quantityInput).toBeEditable();
  await quantityInput.fill(testData.toothCount);

  const descriptionInput = page.locator('//label[@for="deliverableItem.description"]/following-sibling::div/textarea');
  await expect(descriptionInput).toBeVisible();
  await expect(descriptionInput).toBeEditable();
  await descriptionInput.fill(testData.descriptionRequired);

  const categoryInput = page.locator('input[name="productItemExtension.product_item_category"][type="text"]');
  await expect(categoryInput).toBeVisible();
  await expect(categoryInput).toBeEnabled();
  await categoryInput.click();

  const pressureSensitiveOption = page.locator('li[data-label="Pressure Sensitive"]');
  await expect(pressureSensitiveOption).toBeVisible();
  await expect(pressureSensitiveOption).toBeEnabled();
  await pressureSensitiveOption.click();

  const cOfCRequiredCheckbox = page.getByRole('checkbox', { name: 'C of C Required', exact: true });
  await cOfCRequiredCheckbox.check();
  await expect(cOfCRequiredCheckbox).toBeChecked();

  const aibComplianceCheckbox = page.getByRole('checkbox', { name: 'AIB Compliance', exact: true });
  await aibComplianceCheckbox.check();
  await expect(aibComplianceCheckbox).toBeChecked();

  const sqfComplianceCheckbox = page.getByRole('checkbox', { name: 'SQF Compliance', exact: true });
  await sqfComplianceCheckbox.check();
  await expect(sqfComplianceCheckbox).toBeChecked();

  const createButton = page.getByRole('button', { name: 'Create', exact: true });
  await expect(createButton).toBeVisible();
  await expect(createButton).toBeEnabled();
  await createButton.click();

  // const successMessage = page.locator('p').filter({ hasText: 'Product Item created successfully' }).first();
  // await expect(successMessage).toBeVisible();

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const productItemHeading = page.locator('div.title').filter({ hasText: '-Product Item' }).first();
  await expect(productItemHeading).toBeVisible();
  const headingText = ((await productItemHeading.textContent()) || '').trim();
  const productItemId = headingText.split('-Product Item')[0].trim();
  console.log(`[data] Created productItemId: ${productItemId}`);
  expect(productItemId.length).toBeGreaterThan(0);

  const productClassSpan = page.locator('//div[normalize-space()="Product Class"]/following-sibling::div//span');
  await expect(productClassSpan).toBeVisible();
  const productClass = (await productClassSpan.innerText()).trim();
  console.log(`[data] productClass: ${productClass}`);
  await productClassSpan.click();

  const productionSpecsHeading = page.locator('h3').filter({ hasText: 'Production Specifications' }).first();
  await expect(productionSpecsHeading).toBeVisible();

  const expandAllButton = page.getByRole('button', { name: 'Expand All', exact: true });
  await expect(expandAllButton).toBeEnabled();
  await expandAllButton.click();

  const editButton = page.locator('//div[@label="Production Specifications"]//a').last();
  await expect(editButton).toBeVisible();
  await expect(editButton).toBeEnabled();
  await editButton.click();

  const editPage = page.locator('//label[contains(normalize-space(), "Edit Product Route")]');
  await expect(editPage).toBeVisible();

  const expandAllRouteButton = page.getByRole('button', { name: 'Expand All', exact: true });
  await expect(expandAllRouteButton).toBeEnabled();
  await expandAllRouteButton.click();
  await page.waitForTimeout(2000);

  const workflowInput = page.locator("//input[@name='deliverableItemSpecification.workflowId']");
  await expect(workflowInput).toBeVisible();
  await workflowInput.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await workflowInput.click({ force: true });
  const standardDigitalLabelOption = page.locator('li[data-label="Standard Digital Label"]').locator('visible=true').first();
  if (!(await standardDigitalLabelOption.isVisible().catch(() => false))) {
    await workflowInput.click({ force: true });
  }
  await expect(standardDigitalLabelOption).toBeVisible();
  await expect(standardDigitalLabelOption).toBeEnabled();
  await standardDigitalLabelOption.click();

  const plantInput = page.locator("//input[@name='deliverableItemSpecification.plantId']");
  await expect(plantInput).toBeEnabled();
  await plantInput.scrollIntoViewIfNeeded();
  await plantInput.click({ force: true });
  const fortisOption = page.locator('li[data-label="Fortis (99)"]').locator('visible=true').first();
  if (!(await fortisOption.isVisible().catch(() => false))) {
    await plantInput.click({ force: true });
  }
  await expect(fortisOption).toBeEnabled();
  await fortisOption.click();

  const unitSetInput = page.locator("//input[@name='deliverableItemSpecification.unitSetTypeId']");
  await expect(unitSetInput).toBeEnabled();
  await unitSetInput.click();
  const rollsBoxedOption = page.locator('li[data-label="Rolls/Boxed"]');
  await expect(rollsBoxedOption).toBeEnabled();
  await rollsBoxedOption.click();

  const applicationTypeInput = page.locator("//input[@name='deliverableItemSpecification.applicationType']");
  await expect(applicationTypeInput).toBeEnabled();
  await applicationTypeInput.click();
  const handOption = page.locator('li[data-label="Hand"]');
  await expect(handOption).toBeEnabled();
  await handOption.click();

  const slitToInput = page.locator("//input[@name='deliverableItemSpecification.slitTo']");
  await expect(slitToInput).toBeVisible();
  await expect(slitToInput).toBeEditable();
  await slitToInput.click();
  await slitToInput.fill(testData.numberAcrossStep);

  const applicationTempInput = page.locator("//input[@name='deliverableItemSpecification.applicationTemp']");
  await expect(applicationTempInput).toBeEditable();
  await applicationTempInput.fill(testData.applicationTempRequired);

  const surfaceTypeInput = page.locator("//input[@name='deliverableItemSpecification.applicationSurfaceTypeValuelistOptionId']");
  await expect(surfaceTypeInput).toBeEnabled();
  await surfaceTypeInput.click();
  const petgOption = page.locator('li[data-label="PETg"]');
  await expect(petgOption).toBeEnabled();
  await petgOption.click();

  const surfaceTempAfterInput = page.locator("//input[@name='deliverableItemSpecification.surfaceTempAfterApplication']");
  await expect(surfaceTempAfterInput).toBeEditable();
  await surfaceTempAfterInput.fill(testData.surfaceTempAfter);

  const appearanceColorInput = page.locator("//input[@name='deliverableItemSpecification.substrateColor']");
  await expect(appearanceColorInput).toBeEditable();
  await appearanceColorInput.fill(testData.appearanceColorRequired);

  const substrateFaceInput = page.locator("//input[@name='deliverableItemSpecification.substrateFace']");
  await expect(substrateFaceInput).toBeEditable();
  await substrateFaceInput.fill(testData.substrateFaceOrFacestock);

  const adhesiveInput = page.locator("//input[@name='deliverableItemSpecification.substrateAdhesive']");
  await expect(adhesiveInput).toBeEditable();
  await adhesiveInput.fill(testData.adhesiveRequired);

  const linerInput = page.locator("//input[@name='deliverableItemSpecification.substrateLiner']");
  await expect(linerInput).toBeEditable();
  await linerInput.fill(testData.linerRequired);

  const coating = page.locator("//input[@name='deliverableItemSpecification.coatingTypeValuelistOptionId']");
  await expect(coating).toBeEnabled();
  await coating.click();
  await page.waitForTimeout(1000);
  const coatingOption = page.locator('li[data-label="UV Matte"]');
  await expect(coatingOption).toBeEnabled();
  await coatingOption.click();
  await page.waitForTimeout(1000);

  const laminate = page.locator("//input[@name='deliverableItemSpecification.laminateTypeValuelistOptionId']");
  await expect(laminate).toBeEnabled();
  await laminate.click();
  const laminateOption = page.locator('li[data-label="Gloss Laminate"]');
  await expect(laminateOption).toBeEnabled();
  await laminateOption.click();
  await page.waitForTimeout(1000);

  const windDirectionButton = page.getByRole('button', {
    name: '7 - Print in, Right first.',
    exact: true
  });
  await expect(windDirectionButton).toBeEnabled();
  await windDirectionButton.click();

  const otherNotesTextarea = page.locator('//textarea[@name="deliverableItemSpecification.applicationOtherNotes"]');
  await expect(otherNotesTextarea).toBeVisible();
  await expect(otherNotesTextarea).toBeEditable();
  await otherNotesTextarea.fill(testData.otherNotes);

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

  const continueButton4 = page.locator(
    '//h3[normalize-space()="Choose Unit-Template-Picker"]' +
    '//ancestor::div[4]//span[normalize-space()="Continue"]'
  );
  await continueButton4.click();

  const chooseMaterialItemButton = page.getByRole('button', { name: 'Choose Material Item', exact: true }).first();
  await expect(chooseMaterialItemButton).toBeEnabled();
  await chooseMaterialItemButton.click();

  await expect(page.locator('h3').filter({ hasText: /^Choose Material Item$/ }).first()).toBeVisible();

  const MaterialItemquickSearchInput = page.locator("//input[contains(concat(' ', normalize-space(@class), ' '), ' ps-10 ') and @type='text']");
  await expect(MaterialItemquickSearchInput).toBeVisible();
  await expect(MaterialItemquickSearchInput).toBeEditable();
  await MaterialItemquickSearchInput.fill(testData.MaterialItemquickSearch);

  const firstMaterialCell = page.locator('td').filter({ hasText: testData.MaterialItemquickSearch }).first();
  await expect(firstMaterialCell).toBeVisible();
  await expect(firstMaterialCell).toBeEnabled();
  await firstMaterialCell.click();

  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  const chooseMaterialItemButton_laminate = page.getByRole('button', { name: 'Choose Material Item', exact: true }).first();
  await expect(chooseMaterialItemButton_laminate).toBeEnabled();
  await chooseMaterialItemButton_laminate.click();

  const FinishMaterialquickSearchInput = page.locator("//div[normalize-space(.)='Choose Material Item']/following::input[@placeholder='Quick Search']");
  await expect(FinishMaterialquickSearchInput).toBeVisible();
  await FinishMaterialquickSearchInput.fill(testData.Laminate);

  const FinishMaterialCell = page.locator('td').filter({ hasText: testData.Laminate }).first();
  await expect(FinishMaterialCell).toBeVisible();
  await expect(FinishMaterialCell).toBeEnabled();
  await FinishMaterialCell.click();

  const continueButton_finsh = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton_finsh).toBeEnabled();
  await continueButton_finsh.click();

  const rewinderSlitterInput = page.locator("//input[@placeholder='Select a Rewinder/Slitter Class']");
  await rewinderSlitterInput.click();
  const rewinderOption = page.locator('li[data-label="Rewinder"]');
  await expect(rewinderOption).toBeVisible();
  await expect(rewinderOption).toBeEnabled();
  await rewinderOption.click();

  const numberOfSlitsInput = page.locator("//input[@name='deliverableItemWorkflowStepTool.numberOfSlits']");
  await expect(numberOfSlitsInput).toBeVisible();
  await expect(numberOfSlitsInput).toBeEditable();
  await numberOfSlitsInput.fill(testData.numberOfSlits);

  const sheeterInput = page.locator("//input[@placeholder='Select a Sheeter Class']");
  await sheeterInput.click();
  const paperCutterOption = page.locator('li[data-label="Paper Cutter"]');
  await paperCutterOption.click();

  const numberAcrossStepInput = page.locator("//input[@name='deliverableItemSpecification.impositionAc']");
  await expect(numberAcrossStepInput).toBeVisible();
  await numberAcrossStepInput.click();
  await numberAcrossStepInput.fill(testData.numberAcrossStep);

  const numberAroundRepeatInput = page.locator("//input[@name='deliverableItemSpecification.impositionAr']");
  await expect(numberAroundRepeatInput).toBeVisible();
  await numberAroundRepeatInput.click();
  await numberAroundRepeatInput.fill(testData.numberAroundRepeat);

  const toothCountInput = page.locator("//input[@name='deliverableItemSpecification.toothCount']");
  await expect(toothCountInput).toBeVisible();
  await toothCountInput.click();
  await toothCountInput.fill(testData.toothCount);

  const coatingMaterialsCheckbox = page.locator('#inknotrequired-inknotrequired-not-required');
  await coatingMaterialsCheckbox.check();
  await expect(coatingMaterialsCheckbox).toBeChecked();

  const saveProductRouteButton = page.getByRole('button', { name: 'Save Product Route', exact: true });
  await expect(saveProductRouteButton).toBeEnabled();
  await saveProductRouteButton.click();

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const productItemShowHeading = page.locator('div.title').filter({ hasText: `${productItemId}-Product Item` }).first();
  await expect(productItemShowHeading).toBeVisible();
  console.log(`[data] On show page for productItemId: ${productItemId}`);

  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  const expandAllAfterSaveButton = page.getByRole('button', { name: 'Expand All', exact: true });
  await expect(expandAllAfterSaveButton).toBeEnabled();
  await expandAllAfterSaveButton.click();

  const otherNotesDiv = page.locator('div').filter({ hasText: testData.otherNotes }).first();
  await expect(otherNotesDiv).toBeVisible();

  const appearanceColorDiv = page.locator('div').filter({ hasText: testData.appearanceColorRequired }).first();
  await expect(appearanceColorDiv).toBeVisible();

});
