// Create and verify Product Item from Opportunity show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create and Verify Product Item from Opportunity @regression @set1 @mainflow', async ({ page }) => {
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

  const loginSubmitButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(loginSubmitButton).toBeEnabled();
  await loginSubmitButton.click();

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

  const opportunityName = (
    await page.locator('//div[normalize-space()="Name"]/following-sibling::div').first().innerText()
  ).trim();
  console.log(`[data] opportunityName: ${opportunityName}`);

  const customerLeadDiv = page.locator('div').filter({ hasText: 'Customer/Lead Nothing Selected' }).first();
  if (await customerLeadDiv.isVisible()) {
    await expect(customerLeadDiv).toBeEnabled();
    await customerLeadDiv.click();

    const editButton = page.locator('button[x-tooltip="Edit"]');
    await expect(editButton).toBeEnabled();
    await editButton.click();

    const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
    await expect(selectCustomerButton).toBeEnabled();
    await selectCustomerButton.click();

    const quickSearchInput = page.getByPlaceholder('Quick Search').first();
    await expect(quickSearchInput).toBeVisible();
    await expect(quickSearchInput).toBeEditable();
    await quickSearchInput.fill(testData.quickSearch);

    const customerResultCell = page.locator('td').filter({ hasText: testData.quickSearch }).first();
    await expect(customerResultCell).toBeVisible();
    await expect(customerResultCell).toBeEnabled();
    await customerResultCell.click();

    const customerResultDiv = page.locator('div').filter({ hasText: testData.quickSearch }).first();
    await expect(customerResultDiv).toBeVisible();
    await expect(customerResultDiv).toBeEnabled();
    await customerResultDiv.click();

    const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    const saveOpportunityButton = page.locator('button[x-tooltip="Save"]').first();
    await expect(saveOpportunityButton).toBeEnabled();
    await saveOpportunityButton.scrollIntoViewIfNeeded();
    await saveOpportunityButton.click({ force: true });
  }

  await page.mouse.wheel(0, 200);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(2000);

  const newProductItemButton = page.getByRole('button', { name: 'New Product Item & Route', exact: true });
  await expect(newProductItemButton).toBeVisible({ timeout: 15000 });
  await expect(newProductItemButton).toBeEnabled();
  await newProductItemButton.click();

  const customerFieldDiv = page.locator('div').filter({ hasText: testData.quickSearch }).first();
  await expect(customerFieldDiv).toBeVisible();
  await customerFieldDiv.click();

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

  const descriptionInput = page.locator('//textarea[@name="deliverableItem.description"]');
  await expect(descriptionInput).toBeVisible();
  await expect(descriptionInput).toBeEditable();
  await descriptionInput.fill(testData.descriptionRequired);

  const createAndReturnButton = page.getByRole('button', { name: 'Create and Return to Opportunity', exact: true });
  await expect(createAndReturnButton).toBeEnabled();
  await createAndReturnButton.click();

  const productItemCreatedText = page.getByText('Product Item created successfully.', { exact: true });
  await expect(productItemCreatedText).toBeVisible({ timeout: 60000 });

  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(1000);

  const routeDiv = page.locator('div').filter({ hasText: /FG\d+\s+Route #/ }).first();
  await expect(routeDiv).toBeVisible({ timeout: 15000 });
  const routeText = (await routeDiv.innerText()).trim();
  const productItemCode = (routeText.match(/FG\d+/) || [''])[0];
  console.log(`[data] productItemCode: ${productItemCode}`);
  expect(productItemCode.length).toBeGreaterThan(0);
  await expect(routeDiv).toBeEnabled();
  await routeDiv.click();

  const fgDiv = page.locator('div').filter({ hasText: productItemCode }).first();
  await expect(fgDiv).toBeVisible();
  await expect(fgDiv).toBeEnabled();
  await fgDiv.click();

  const openLink = page.locator('a[x-tooltip="Open"]').first();
  await expect(openLink).toBeVisible();
  await expect(openLink).toBeEnabled();
  await openLink.click();

  const productItemHeading = page.locator('div').filter({ hasText: `${productItemCode}-Product Item` }).first();
  await expect(productItemHeading).toBeVisible();
  await expect(productItemHeading).toBeEnabled();
  await productItemHeading.click();

  const oppLink = page.getByRole('link', { name: `${opportunityNumber}-${opportunityName}`, exact: true });
  await expect(oppLink).toBeVisible();
  await expect(oppLink).toBeEnabled();
  await oppLink.click();

  const finalOppHeading = page.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first();
  await expect(finalOppHeading).toBeVisible();
  await finalOppHeading.click();
});
