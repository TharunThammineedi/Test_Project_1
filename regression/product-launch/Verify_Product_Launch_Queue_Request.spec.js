// Create Product Item, approve route, request launch, verify Product Launch Queue
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Product Launch Queue request after Product Item approval @regression @set2', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] customerPartNumberRequired: ${session.customerPartNumberRequired}`);
  console.log(`[data] descriptionRequired: ${session.descriptionRequired}`);

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

  const loginConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(loginConfirmButton).toBeEnabled();
  await loginConfirmButton.click();
  await page.waitForLoadState('domcontentloaded');

  const itemsButton = page.locator('button').filter({ hasText: 'Items' }).first();
  await expect(itemsButton).toBeEnabled();
  await itemsButton.click();

  const productItemsLink = page.getByRole('link', { name: 'Product Items', exact: true });
  await expect(productItemsLink).toBeVisible();
  await expect(productItemsLink).toBeEnabled();
  await productItemsLink.click();
  await page.waitForLoadState('domcontentloaded');

  const newProductItemLink = page.getByRole('link', { name: 'New Product Item', exact: true });
  await expect(newProductItemLink).toBeVisible();
  await expect(newProductItemLink).toBeEnabled();
  await newProductItemLink.click();
  await page.waitForLoadState('domcontentloaded');

  const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  const quickSearchInput = page.getByPlaceholder('Quick Search').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();
  await quickSearchInput.fill(testData.quickSearch);

  const customerCell = page.locator('td').filter({ hasText: testData.quickSearch }).first();
  await expect(customerCell).toBeVisible();
  await expect(customerCell).toBeEnabled();
  await customerCell.click();
  await page.waitForTimeout(2000);

  const customerContinueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(customerContinueButton).toBeEnabled();
  await customerContinueButton.click();

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

  const descriptionInput = page.locator('//label[@for="deliverableItem.description"]/following-sibling::div/textarea');
  await expect(descriptionInput).toBeVisible();
  await expect(descriptionInput).toBeEditable();
  await descriptionInput.fill(testData.descriptionRequired);

  const cOfCRequiredCheckbox = page.getByRole('checkbox', { name: 'C of C Required', exact: true });
  await cOfCRequiredCheckbox.check();
  await expect(cOfCRequiredCheckbox).toBeChecked();

  const aibComplianceCheckbox = page.getByRole('checkbox', { name: 'AIB Compliance', exact: true });
  await aibComplianceCheckbox.check();
  await expect(aibComplianceCheckbox).toBeChecked();

  const sqfComplianceCheckbox = page.getByRole('checkbox', { name: 'SQF Compliance', exact: true });
  await sqfComplianceCheckbox.check();
  await expect(sqfComplianceCheckbox).toBeChecked();

  const productItemCategoryInput = page.locator('input[name="productItemExtension.product_item_category"][type="text"]');
  await expect(productItemCategoryInput).toBeVisible();
  await expect(productItemCategoryInput).toBeEnabled();
  await productItemCategoryInput.click();

  const sheetedOption = page.locator('li[data-label="Sheeted"]');
  await expect(sheetedOption).toBeVisible();
  await expect(sheetedOption).toBeEnabled();
  await sheetedOption.click();

  const coreDiameterInput = page.locator('input[name="specification.core_diameter_id"][type="text"]');
  await expect(coreDiameterInput).toBeVisible();
  await expect(coreDiameterInput).toBeEnabled();
  await coreDiameterInput.click();

  const coreDiameterOption = page.locator('li[data-label="1"]');
  await expect(coreDiameterOption).toBeVisible();
  await expect(coreDiameterOption).toBeEnabled();
  await coreDiameterOption.click();

  const createButton = page.getByRole('button', { name: 'Create', exact: true });
  await expect(createButton).toBeEnabled();
  await createButton.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const productItemHeading = page.getByText(/^[A-Z]+\d+\s*-\s*Product Item$/).first();
  await expect(productItemHeading).toBeVisible();
  const productItemId = ((await productItemHeading.innerText()) || '').replace(/\s*-\s*Product Item$/, '').trim();
  console.log(`[data] productItemId: ${productItemId}`);
  expect(productItemId.length).toBeGreaterThan(0);

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
  await page.waitForTimeout(2000);

  const continueButton4 = page.locator(
    '//h3[normalize-space()="Choose Unit-Template-Picker"]' +
    '//ancestor::div[4]//span[normalize-space()="Continue"]'
  );
  await expect(continueButton4).toBeVisible();
  await expect(continueButton4).toBeEnabled();
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
  await page.waitForTimeout(2000);

  const numberAcrossStepInput = page.locator("//input[@name='deliverableItemSpecification.impositionAc']");
  await expect(numberAcrossStepInput).toBeVisible();
  await expect(numberAcrossStepInput).toBeEditable();
  await numberAcrossStepInput.click();
  await numberAcrossStepInput.fill(testData.numberAcrossStep);
  await page.waitForTimeout(3000);

  const numberAroundRepeatInput = page.locator("//input[@name='deliverableItemSpecification.impositionAr']");
  await expect(numberAroundRepeatInput).toBeVisible();
  await expect(numberAroundRepeatInput).toBeEditable();
  await numberAroundRepeatInput.click();
  await numberAroundRepeatInput.fill(testData.numberAroundRepeat);
  await page.waitForTimeout(3000);

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

  // Return to Product Item show (known id; allow spaces; reload if navigation stalls under load)
  const productItemShowHeading = page
    .locator('div.title')
    .filter({ hasText: new RegExp(`${productItemId}\\s*-\\s*Product Item`) })
    .first();
  if (!(await productItemShowHeading.isVisible().catch(() => false))) {
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  }
  await expect(productItemShowHeading).toBeVisible();
  await expect(productionSpecsHeading).toBeVisible();

  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  const goToSubmissionButton = page.locator('//div[@x-tooltip="Go to Submission page"]//button[@type="button"]');
  await expect(goToSubmissionButton).toBeVisible();
  await expect(goToSubmissionButton).toBeEnabled();
  await goToSubmissionButton.click();
  await page.waitForLoadState('domcontentloaded');

  const addFilesButton = page.getByRole('button', { name: 'Add Files', exact: true });
  await expect(addFilesButton).toBeEnabled();
  const [artChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    addFilesButton.click(),
  ]);
  await artChooser.setFiles('test-assets/FG0118_001.pdf');
  await page.waitForTimeout(3000);

  const backToProductItemButton = page.getByRole('button', { name: 'Back to Product Item', exact: true });
  await expect(backToProductItemButton).toBeEnabled();
  await backToProductItemButton.click();
  await page.waitForLoadState('domcontentloaded');

  const goToProofApprovalButton = page.locator('//div[@x-tooltip="Go to Proof Approval page"]//button[@type="button"]');
  await expect(goToProofApprovalButton).toBeVisible();
  await expect(goToProofApprovalButton).toBeEnabled();
  await goToProofApprovalButton.click();
  await page.waitForLoadState('domcontentloaded');

  const addFilesButton2 = page.getByRole('button', { name: 'Add Files', exact: true });
  await expect(addFilesButton2).toBeEnabled();
  const [proofChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    addFilesButton2.click(),
  ]);
  await proofChooser.setFiles('test-assets/FG0521_001.pdf');
  await page.waitForTimeout(3000);

  const backToProductItemButton2 = page.getByRole('button', { name: 'Back to Product Item', exact: true });
  await expect(backToProductItemButton2).toBeEnabled();
  await backToProductItemButton2.click();
  await page.waitForLoadState('domcontentloaded');

  // Art Set id + Approved status (Product Route + Art Sets)
  const artSetSpan = page.locator('//span[starts-with(normalize-space(), "ART")]').last();
  await expect(artSetSpan).toBeVisible();
  const artSetId = ((await artSetSpan.innerText()) || '').trim();
  console.log(`[data] artSetId: ${artSetId}`);
  expect(artSetId).toMatch(/^ART\d+$/);

  const approvedBadges = page.locator('#badge-Approved');
  await expect(approvedBadges).toHaveCount(2);
  await expect(approvedBadges.first()).toBeVisible();
  await expect(approvedBadges.nth(1)).toBeVisible();

  // Request Launch from Product Route row actions (cell after first Approved badge)
  const productRouteRowMenu = page.locator('//span[@id="badge-Approved"]//..//..//following-sibling::td').first();
  await expect(productRouteRowMenu).toBeVisible();
  await expect(productRouteRowMenu).toBeEnabled();
  await productRouteRowMenu.click();

  const requestLaunchButton = page.getByText('Request Launch', { exact: true }).first();
  await expect(requestLaunchButton).toBeVisible();
  await expect(requestLaunchButton).toBeEnabled();
  await requestLaunchButton.click();

  const confirmButton = page.getByRole('button', { name: 'Confirm', exact: true });
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  const launchRequestedMessage = page.locator('p').filter({
    hasText: 'Product launch requested. This route is now on the Product Launch Queue.',
  }).first();
  await expect(launchRequestedMessage).toBeVisible();

  const estimatingPricingButton = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
  await expect(estimatingPricingButton).toBeEnabled();
  await estimatingPricingButton.click();

  const productLaunchQueueLink = page.getByRole('link', { name: 'Product Launch Queue', exact: true });
  await expect(productLaunchQueueLink).toBeVisible();
  await expect(productLaunchQueueLink).toBeEnabled();
  await productLaunchQueueLink.click();
  await page.waitForLoadState('domcontentloaded');

  const launchQueueQuickSearch = page.getByPlaceholder('Quick Search').first();
  await expect(launchQueueQuickSearch).toBeVisible();
  await launchQueueQuickSearch.fill(productItemId);
  await page.waitForTimeout(2000);

  const launchQueueRows = page.locator('tbody tr').filter({ hasText: productItemId });
  await expect(launchQueueRows).toHaveCount(1);
  await expect(launchQueueRows.first()).toBeVisible();

  const queueStatusSpan = launchQueueRows.first().locator('xpath=.//td[9]//span');
  await expect(queueStatusSpan).toBeVisible();
  await expect(queueStatusSpan).toHaveText('Requested');
  console.log(`[data] queueStatus: ${((await queueStatusSpan.innerText()) || '').trim()}`);

  const tooltipText = (await launchQueueRows.first().locator('[x-tooltip]').first().getAttribute('x-tooltip') || '').trim();
  const [productRouteId, productRouteName] = tooltipText.split(' | ').map((s) => s.trim());
  console.log(`[data] productRouteId: ${productRouteId}`);
  console.log(`[data] productRouteName: ${productRouteName}`);
  expect(productRouteId).toBeTruthy();
  expect(productRouteName).toBeTruthy();

  // Queue retained after page refresh
  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  const launchQueueQuickSearchAfterRefresh = page.getByPlaceholder('Quick Search').first();
  await expect(launchQueueQuickSearchAfterRefresh).toBeVisible();
  await launchQueueQuickSearchAfterRefresh.fill(productItemId);
  await page.waitForTimeout(2000);

  const launchQueueRowsAfterRefresh = page.locator('tbody tr').filter({ hasText: productItemId });
  await expect(launchQueueRowsAfterRefresh).toHaveCount(1);
  await expect(launchQueueRowsAfterRefresh.first()).toBeVisible();

  const tooltipTextAfterRefresh = (await launchQueueRowsAfterRefresh.first().locator('[x-tooltip]').first().getAttribute('x-tooltip') || '').trim();
  expect(tooltipTextAfterRefresh).toBe(`${productRouteId} | ${productRouteName}`);

  await launchQueueRowsAfterRefresh.first().click();
  await page.waitForLoadState('domcontentloaded');

  const routeNameCell = page.locator(
    '//span[@id="badge-Approved"]/ancestor::td/preceding-sibling::td[1]'
  ).first();
  await expect(routeNameCell).toContainText(productRouteName);
  await expect(routeNameCell).toHaveAttribute('title', productRouteName);

  const routeIdCell = page.locator('//span[@id="badge-Requested"]/ancestor::td').first();
  await expect(routeIdCell).toContainText(productRouteId);
  await expect(page.locator('#badge-Requested')).toBeVisible();
});
