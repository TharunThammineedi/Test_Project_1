// Navigate Opportunity from Product Item (Links → Open → Opportunity show page)
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Navigate Opportunity from Product Item @regression @set2', async ({ page }) => {
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

  const linksTabButton = page.locator('[data-cy="hub-tab-links"]');
  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();
  await page.waitForTimeout(2000);

  const existingOppChip = page.locator('span[x-tooltip^="OPP"]').first();
  const chooseOpportunitiesButton = page.locator('//button[normalize-space()="Choose Opportunities"]').first();
  let opportunityId;

  if (await existingOppChip.isVisible()) {
    opportunityId = (await existingOppChip.getAttribute('x-tooltip') || '').trim();
    console.log(`[data] already linked opportunityId: ${opportunityId}`);
  } else {
    await expect(chooseOpportunitiesButton).toBeEnabled();
    await chooseOpportunitiesButton.click();
    await page.waitForTimeout(2000);

    const firstOpportunityNameCell = page.locator('(//tbody//tr[1]//td[3]//div)[2]').first();
    await expect(firstOpportunityNameCell).toBeVisible();
    const opportunityName = (await firstOpportunityNameCell.textContent() || '').trim();
    console.log(`[data] opportunityName: ${opportunityName}`);
    await firstOpportunityNameCell.click();

    const oppCodeCell = page.locator('(//tbody//tr[1]//td[2]//div)[2]').first();
    await expect(oppCodeCell).toBeVisible();
    opportunityId = (await oppCodeCell.textContent() || '').trim();
    console.log(`[data] opportunityId: ${opportunityId}`);
    await page.waitForTimeout(2000);

    const continueButton = page.locator('//h3[normalize-space()="Choose Opportunity"]//..//..//..//..//button[normalize-space()="Continue"]');
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    const codeDateDescriptionHeading = page.locator('div').filter({ hasText: 'CODE DATE DESCRIPTION' }).first();
    await expect(codeDateDescriptionHeading).toBeVisible();
  }

  const viewAllButton = page.locator('//button[contains(normalize-space(),"View All")]').first();
  if (await viewAllButton.isVisible()) {
    await viewAllButton.click();
  }

  const opportunityAdded = page.locator('//span[@x-tooltip="' + opportunityId + '"]').first();
  await expect(opportunityAdded).toBeVisible();
  await opportunityAdded.click();

  // Open → Opportunity show page

  const openLink = page.locator('//div[normalize-space()="' + opportunityId + '"]//a').first();
  await expect(openLink).toBeVisible();
  await expect(openLink).toBeEnabled();
  await openLink.click();

  await page.waitForLoadState('domcontentloaded');
  const opportunityPageHeading = page.locator('//div[@id="info-project"][contains(normalize-space(),"' + opportunityId + '")]').first();
  await expect(opportunityPageHeading).toBeVisible();
});
