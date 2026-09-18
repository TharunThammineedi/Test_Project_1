// Create Product Item, verify general info, edit, add note
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create Product Item with general info, edit and note @regression @set2', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] customerPartNumberRequired: ${session.customerPartNumberRequired}`);
  console.log(`[data] brandName: ${session.brandName}`);
  console.log(`[data] itemDefaultCost: ${session.itemDefaultCost}, itemDefaultPrice: ${session.itemDefaultPrice}`);

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

  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();
  const cancelCustomerButton = page.getByRole('button', { name: 'Cancel', exact: true }).first();
  await expect(cancelCustomerButton).toBeVisible();

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

  const successMessage = page.locator('p').filter({ hasText: 'Product Item created successfully' }).first();
  await expect(successMessage).toBeVisible();

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const productItemHeading = page.locator('div').filter({ hasText: '-Product Item' }).first();
  await expect(productItemHeading).toBeVisible();
  const headingText = (await productItemHeading.textContent() || '').trim();
  const productItemId = headingText.split('-Product Item')[0].trim();
  console.log(`[data] Created productItemId: ${productItemId}`);
  expect(productItemId.length).toBeGreaterThan(0);

  const productItemInfoSection = page.locator('div').filter({ hasText: 'Product Item Information' }).first();
  await expect(productItemInfoSection).toBeVisible();

  const detailsTabButton = page.locator('[data-cy="hub-tab-details"]');
  await expect(detailsTabButton).toBeVisible();

  const productClassPrimeLabel = page.locator('div').filter({ hasText: 'Product Class Prime Label' }).first();
  await expect(productClassPrimeLabel).toBeVisible();

  const descriptionOnShowPage = page
    .locator('div')
    .filter({ hasText: `Description ${testData.descriptionRequired}` })
    .first();
  await expect(descriptionOnShowPage).toBeVisible();

  const brandNameSpan = page
    .locator('span')
    .filter({ hasText: `Brand Name: ${testData.brandName}` })
    .first();
  await expect(brandNameSpan).toBeVisible();

  const customerPartNumberSpan = page
    .locator('span')
    .filter({ hasText: `Customer Part # ${testData.customerPartNumberRequired}` })
    .first();
  await expect(customerPartNumberSpan).toBeVisible();

  const productItemCategorySpan = page.locator(
    '//div[normalize-space()="Product Item Category"]/following-sibling::div//span'
  );
  await expect(productItemCategorySpan).toHaveText('Pressure Sensitive');

  const salesUnitSpan = page.locator(
    '//div[normalize-space()="Sales Unit"]/following-sibling::div//span'
  );
  await expect(salesUnitSpan).toHaveText('Feet');

  const quantitySalesUnitSpan = page.locator(
    '//div[normalize-space()="Quantity in Sales UOM"]/following-sibling::div//span'
  );
  await expect(quantitySalesUnitSpan).toHaveText(testData.toothCount);

  const cOfCRequiredYesDiv = page.locator('div').filter({ hasText: 'C of C Required Yes' }).first();
  await expect(cOfCRequiredYesDiv).toBeVisible();

  const aibComplianceYesDiv = page.locator('div').filter({ hasText: 'AIB Compliance Yes' }).first();
  await expect(aibComplianceYesDiv).toBeVisible();

  const sqfComplianceYesDiv = page.locator('div').filter({ hasText: 'SQF Compliance Yes' }).first();
  await expect(sqfComplianceYesDiv).toBeVisible();

  const productRouteHeading = page.locator('h3').filter({ hasText: 'Product Route' }).first();
  await expect(productRouteHeading).toBeVisible();

  // Edit the product item just created
  const editButton = page.locator('button[x-tooltip="Edit"][wire\\:click="openEdit"]');
  await expect(editButton).toBeEnabled();
  await editButton.click();

  const DescriptionTextarea = page.locator('//textarea[@id="deliverableItem.description"]');
  await expect(DescriptionTextarea).toBeVisible();
  await expect(DescriptionTextarea).toBeEditable();
  await DescriptionTextarea.fill(testData.estimate);

  const defaultCostInput = page.locator('//div[normalize-space()="Default Unit Cost"]/following-sibling::div//input');
  await expect(defaultCostInput).toBeEditable();
  await defaultCostInput.fill(testData.itemDefaultCost);
  await expect(defaultCostInput).toHaveValue(testData.itemDefaultCost);

  const defaultPriceInput = page.locator('//div[normalize-space()="Default Unit Price"]/following-sibling::div//input');
  await expect(defaultPriceInput).toBeEditable();
  await defaultPriceInput.fill(testData.itemDefaultPrice);
  await expect(defaultPriceInput).toHaveValue(testData.itemDefaultPrice);

  const saveButton = page.locator('[data-cy="hub-save-button"]');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const savedDescription = page.locator('//div[normalize-space()="Description"]//following-sibling::div/span').first();
  await expect(savedDescription).toBeVisible();
  await expect(savedDescription).toBeEnabled();
  await expect(savedDescription).toHaveText(testData.estimate);

  const savedDefaultCost = page.locator('//div[normalize-space()="Default Unit Cost"]/following-sibling::div//span').first();
  await expect(savedDefaultCost).toBeVisible();
  await expect(savedDefaultCost).toBeEnabled();
  await expect(savedDefaultCost).toHaveText(`$${Number(testData.itemDefaultCost).toFixed(2)}`);

  const savedDefaultPrice = page.locator('//div[normalize-space()="Default Unit Price"]/following-sibling::div//span').first();
  await expect(savedDefaultPrice).toBeVisible();
  await expect(savedDefaultPrice).toBeEnabled();
  await expect(savedDefaultPrice).toHaveText(`$${Number(testData.itemDefaultPrice).toFixed(2)}`);

  // Add note on the same product item
  const newNoteButton = page.locator('//span[normalize-space()="New Note"]').first();
  await expect(newNoteButton).toBeEnabled();
  await page.waitForTimeout(3000);
  await newNoteButton.click();

  const quillEditor = page.locator('.ql-editor').first();
  await quillEditor.fill(testData.description);

  const saveNoteButton = page.locator('button[x-tooltip="Save"][wire\\:click="create"]');
  await expect(saveNoteButton).toBeEnabled();
  await saveNoteButton.scrollIntoViewIfNeeded();
  await saveNoteButton.click({ force: true });

  const noteCreatedDiv = page.locator('div').filter({ hasText: 'Note created successfully.' }).first();
  await expect(noteCreatedDiv).toBeVisible();

  const alertSummaryDiv = page.locator('div').filter({ hasText: 'ALERT DATE CREATED DATE MODIFIED CREATED BY NOTES' }).first();
  await expect(alertSummaryDiv).toBeVisible();

  const rohithRangaDiv = page.locator('div').filter({ hasText: 'Ranga Sharan Rohith' }).first();
  await expect(rohithRangaDiv).toBeVisible();
  await expect(rohithRangaDiv).toBeEnabled();
});
