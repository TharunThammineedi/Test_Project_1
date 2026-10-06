// Create PrePress from Product Item
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Create PrePress from Product Item @regression @set2 @mainflow', async ({ page }) => {
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

  const loginConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(loginConfirmButton).toBeEnabled();
  await loginConfirmButton.click();

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
  const firstProductItemText = (await firstProductItem.textContent() || '').split(/\s*\|\s*/)[0].trim().replace(/\|/g, '').trim();
  console.log(`[data] productItemId: ${firstProductItemText}`);

  const productItems_list = page.locator('p').filter({ hasText: firstProductItemText }).first();
  await expect(productItems_list).toBeVisible();
  await firstProductItem.click();

  await page.waitForTimeout(2000);
  const productItemDetailHeading = page.locator('div').filter({ hasText: `${firstProductItemText}-Product Item` }).first();
  await expect(productItemDetailHeading).toBeVisible();
  await expect(productItemDetailHeading).toBeEnabled();

  const goToPrepressRequestButton = page.getByRole('button', { name: 'Go to Prepress Request', exact: true });
  const newPrepressRequestButton = page.getByRole('button', { name: 'New Prepress Request', exact: true });

  const prepressTableRows = page.locator('//h3[normalize-space()="Prepress Request"]/following::table[1]//tbody/tr');
  const noPrepressText = page.locator('//*[contains(normalize-space(.),"doesn\'t have any prepress request")]').first();
  const prepressCount = (await noPrepressText.isVisible()) ? 0 : await prepressTableRows.count();
  console.log(`[data] prepressCount: ${prepressCount}`);

  let prepressPage = page;

  if (prepressCount === 0) {
    await expect(newPrepressRequestButton).toBeVisible();
    await expect(newPrepressRequestButton).toBeEnabled();

    const [newPrepressPage] = await Promise.all([
      page.context().waitForEvent('page'),
      newPrepressRequestButton.click()
    ]);
    prepressPage = newPrepressPage;
    await prepressPage.waitForLoadState('domcontentloaded');
    await prepressPage.waitForTimeout(2000);

    const continueButton = prepressPage.locator('//button[normalize-space()="Continue"]').last();
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();

    const selectCustomer = prepressPage.locator('//p[normalize-space()="Select Customer"]').first();
    if (await selectCustomer.isVisible()) {
      await selectCustomer.click();

      const quickSearchInput = prepressPage
        .locator("//span[normalize-space()='Customer Only']/ancestor::div[3]//input[@placeholder='Quick Search']")
        .first();
      await expect(quickSearchInput).toBeVisible();
      await expect(quickSearchInput).toBeEditable();
      await quickSearchInput.fill(testData.quickSearch);

      const customerCell = prepressPage.locator('td').filter({ hasText: testData.quickSearch }).first();
      await expect(customerCell).toBeVisible();
      await expect(customerCell).toBeEnabled();
      await prepressPage.waitForTimeout(4000);
      await customerCell.click();

      const unlinkButton = prepressPage.getByRole('button', { name: 'Unlink', exact: true });
      await expect(unlinkButton).toBeVisible();

      const continueCustomerPickerButton = prepressPage.getByRole('button', { name: 'Continue', exact: true }).first();
      await expect(continueCustomerPickerButton).toBeEnabled();
      await continueCustomerPickerButton.click();

      const selectedCustomerButton = prepressPage.getByRole('button', { name: testData.customerName, exact: true });
      await expect(selectedCustomerButton).toBeVisible();
    }
    await prepressPage.waitForTimeout(4000);
    const chooseProductRoutes = prepressPage.locator('//p[text()="Choose Product Routes"]').first();
    if (await chooseProductRoutes.isVisible()) {
      await chooseProductRoutes.click();

      const productRoutesQuickSearch = prepressPage.locator('input[placeholder="Quick Search"]').first();
      await expect(productRoutesQuickSearch).toBeVisible();
      await expect(productRoutesQuickSearch).toBeEditable();
      await productRoutesQuickSearch.fill(testData.customerName);
      await prepressPage.waitForTimeout(2000);

      const secondRouteRow = prepressPage.locator('//h3[normalize-space()="Choose Product Routes"]/following::tbody/tr').nth(1);
      await expect(secondRouteRow).toBeVisible();
      await secondRouteRow.click();
      await prepressPage.waitForTimeout(3000);

      const continueRoutesButton = prepressPage
        .locator('//h3[normalize-space()="Choose Product Routes"]/following::button[.//span[normalize-space()="Continue"]]')
        .first();
      await expect(continueRoutesButton).toBeVisible();
      await expect(continueRoutesButton).toBeEnabled();
      await continueRoutesButton.click({ force: true });
    }

    const continueLastButton = prepressPage.getByRole('button', { name: 'Continue', exact: true }).last();
    await expect(continueLastButton).toBeEnabled();
    await continueLastButton.click();
  } else {
    if (await goToPrepressRequestButton.isVisible()) {
      await expect(goToPrepressRequestButton).toBeEnabled();
      await goToPrepressRequestButton.click();
    } else {
      await expect(prepressTableRows.first()).toBeVisible();
      await prepressTableRows.first().click();
    }
    await page.waitForTimeout(2000);
  }

  await prepressPage.waitForTimeout(2000);

  const requestNumberSpan = prepressPage.locator('//div[@id="info-prepress-queue"]//span[contains(normalize-space(),"Request")]').first();
  await expect(requestNumberSpan).toBeVisible();
  const requestNumberText = ((await requestNumberSpan.textContent()) || '').trim();
  const requestNumber = (requestNumberText.split('#')[1] || '').trim();
  console.log(`[data] requestNumber: ${requestNumber}`);
  expect(requestNumber.length).toBeGreaterThan(0);

  await prepressPage.reload();
  await prepressPage.waitForLoadState('domcontentloaded');

  const waitingForArtBadge = prepressPage.locator('[id="badge-Waiting for Art"]').first();
  await expect(waitingForArtBadge).toBeVisible();
  await expect(waitingForArtBadge).toBeEnabled();
  await waitingForArtBadge.click();

  const draftBadge = prepressPage.locator('[id="badge-Draft"]').first();
  await expect(draftBadge).toBeVisible();

  const openLink = prepressPage
    .locator(`//span[contains(normalize-space(.),"${firstProductItemText}")]/following::div[@x-tooltip="Open"][1]/parent::a`)
    .first();
  await expect(openLink).toBeVisible();
  await expect(openLink).toBeEnabled();
  await openLink.click();
  await prepressPage.waitForLoadState('domcontentloaded');
  await prepressPage.waitForTimeout(2000);

  const productItemHeading = prepressPage.locator('div').filter({ hasText: `${firstProductItemText}-Product Item` }).first();
  await expect(productItemHeading).toBeVisible();

  const productRouteHeading = prepressPage.locator('h3').filter({ hasText: 'Product Route' }).first();
  await expect(productRouteHeading).toBeVisible();

  const productRouteWaitingBadge = prepressPage
    .locator('//h3[normalize-space()="Product Route"]/following::table[1]//span[@id="badge-Waiting for Art"]')
    .first();
  await expect(productRouteWaitingBadge).toBeVisible();
  const productRouteId = ((await productRouteWaitingBadge.locator('xpath=ancestor::td[1]').innerText()) || '')
    .replace(/Waiting for Art/i, '')
    .trim();
  console.log(`[data] productRouteId: ${productRouteId}`);
  expect(productRouteId.length).toBeGreaterThan(0);

  const artSetSpan = prepressPage
    .locator('//h3[normalize-space()="Art Sets"]/following::table[1]//span[starts-with(normalize-space(),"ART")]')
    .first();
  await expect(artSetSpan).toBeVisible();
  const artSetId = ((await artSetSpan.innerText()) || '').trim();
  console.log(`[data] artSetId: ${artSetId}`);
  expect(artSetId).toMatch(/^ART\d+$/);

  const artSetWaitingBadge = prepressPage
    .locator('//h3[normalize-space()="Art Sets"]/following::table[1]//span[@id="badge-Waiting for Art"]')
    .first();
  await expect(artSetWaitingBadge).toBeVisible();
});
