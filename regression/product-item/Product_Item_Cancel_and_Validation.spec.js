// Product Item cancel creation and mandatory field validation
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test.describe('Product Item Cancel and Validation @regression @set2', () => {
  test.describe.configure({ mode: 'serial' });

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
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
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Product Item Cancel Creation @regression @set2', async () => {
    const session = prepareSession({ force: true });
    Object.assign(testData, session);
    console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

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

    const createButton = page.getByRole('button', { name: 'Create', exact: true });
    await expect(createButton).toBeVisible();

    const cancelButton = page.locator('//span[normalize-space()="Create"]//preceding::span[normalize-space()="Cancel"][1]');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    const newProductItemLink_Back = page.getByRole('link', {
      name: 'New Product Item',
      exact: true
    });
    await expect(newProductItemLink_Back).toBeVisible();
  });

  test('Product Item Mandatory Field Validation @regression @set2', async () => {
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

    const createButton = page.getByRole('button', { name: 'Create', exact: true });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    const customerRequiredText = page.locator('p').filter({ hasText: 'A customer is required to create a product item.' }).first();
    await expect(customerRequiredText).toBeVisible();

    const productClassIdRequiredText = page.locator('p').filter({ hasText: 'The product class id field is required.' }).first();
    await expect(productClassIdRequiredText).toBeVisible();

    const customerPartNumberRequiredAlert = page.getByRole('alert').filter({ hasText: 'The customer part number field is required' });
    await expect(customerPartNumberRequiredAlert).toBeVisible();

    const descriptionRequiredText = page.locator('p').filter({ hasText: 'The description field is required.' }).first();
    await expect(descriptionRequiredText).toBeVisible();

    const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
    await expect(selectCustomerButton).toBeVisible();
  });
});
