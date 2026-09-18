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
  await newPrepressRequestButton.click();

  if (!(await goToPrepressRequestButton.isVisible())) {
    await expect(newPrepressRequestButton).toBeEnabled();

    const requestNumberSpan = page.locator('//div[@id="info-prepress-queue"]//span[contains(normalize-space(),"Request")]').first();
    await expect(requestNumberSpan).toBeVisible();
    const requestNumberText = await requestNumberSpan.textContent();
    const requestNumber = requestNumberText.trim().split('#')[1];
    console.log(`[data] requestNumber: ${requestNumber}`);

    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    const artSpan = page.locator('//div[@id="info-prepress-queue"]//span[contains(normalize-space(),"ART")]').first();
    await expect(artSpan).toBeVisible();
    const artNumberText = await artSpan.textContent();
    const artNumber = artNumberText.split(' ')[1].trim();
    console.log(`[data] artNumber: ${artNumber}`);

    const waitingForArtBadge = page.locator('[id="badge-Waiting for Art"]');
    await expect(waitingForArtBadge).toBeVisible();
    await expect(waitingForArtBadge).toBeEnabled();
    await waitingForArtBadge.click();

    const draftBadge = page.locator('[id="badge-Draft"]');
    await expect(draftBadge).toBeVisible();

    const openLink = page.locator('a[x-tooltip="Open"]');
    await expect(openLink).toBeVisible();
    await expect(openLink).toBeEnabled();
    await openLink.click();

    const requestNumberSpanAgain = page.locator('span').filter({ hasText: new RegExp(`^Request #${requestNumber}$`) }).first();
    await expect(requestNumberSpanAgain).toBeVisible();
    await requestNumberSpanAgain.click();
  }
});
