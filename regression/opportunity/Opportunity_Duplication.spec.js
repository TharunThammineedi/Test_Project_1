// Opportunity duplicate check: reuse existing name (TC12), then edit name and create (TC13)
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Opportunity duplication and edit from confirm @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] uniqueOpportunityName: ${session.opportunityName}`);

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

  const customerMenuButton = page.locator('(//button[normalize-space()="Customer"])[1]');
  await customerMenuButton.click();

  const opportunitiesLink = page.getByRole('link', { name: 'Opportunities', exact: true });
  await expect(opportunitiesLink).toBeVisible();
  await expect(opportunitiesLink).toBeEnabled();
  await opportunitiesLink.click();

  await page.waitForLoadState('domcontentloaded');

  const mineToggle = page.locator('//span[normalize-space()="Mine"]/following-sibling::div/button');
  await expect(mineToggle).toBeVisible();
  await expect(mineToggle).toBeEnabled();
  await mineToggle.click();
  await page.waitForTimeout(2000);
  await expect(mineToggle).toHaveClass(/bg-denim-blue-600/);

  const firstOpportunityName = page.locator('//tbody//tr[1]//td[3]//div').first();
  await expect(firstOpportunityName).toBeVisible();
  const firstOpportunityNameText = ((await firstOpportunityName.textContent()) || '').trim();
  console.log(`[data] firstOpportunityNameText: ${firstOpportunityNameText}`);
  expect(firstOpportunityNameText.length).toBeGreaterThan(0);

  const firstOpportunityCustomerName = page.locator('//tbody//tr[1]//td[5]//div').first();
  const firstOpportunityCustomerNameText = ((await firstOpportunityCustomerName.textContent()) || '').trim();
  console.log(`[data] firstOpportunityCustomerNameText: ${firstOpportunityCustomerNameText}`);

  // --- TC12: create with existing opportunity name → duplicate check → add anyway ---
  const newOpportunityButton = page.getByRole('button', { name: 'New Opportunity', exact: true });
  await expect(newOpportunityButton).toBeEnabled();
  await newOpportunityButton.click();

  const newOpportunityHeader = page.locator('//h2[normalize-space()="New Opportunity"]');
  await expect(newOpportunityHeader).toBeVisible();

  const formTab = page.locator('div').filter({ hasText: /^Form$/ }).first();
  await expect(formTab).toBeVisible();
  await expect(formTab).toBeEnabled();
  await formTab.click();

  const previewTab = page.locator('div').filter({ hasText: /^Preview$/ }).first();
  await expect(previewTab).toBeVisible();
  await expect(previewTab).toBeEnabled();
  await previewTab.click();

  const duplicateCheckTab = page.locator('div').filter({ hasText: /^Duplicate check$/ }).first();
  await expect(duplicateCheckTab).toBeVisible();
  await expect(duplicateCheckTab).toBeEnabled();
  await duplicateCheckTab.click();

  const nameRequiredInput = page.locator('input[name="project.name"][type="text"]');
  await expect(nameRequiredInput).toBeVisible();
  await expect(nameRequiredInput).toBeEditable();
  await nameRequiredInput.fill(firstOpportunityNameText);

  const descriptionInput = page.locator('textarea[name="project.description"]');
  await expect(descriptionInput).toBeVisible();
  await expect(descriptionInput).toBeEditable();
  await descriptionInput.fill(testData.description);

  const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
  await expect(selectCustomerButton).toBeVisible();
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  const customerHeading = page.locator('//h3[normalize-space()="Choose Customer / Lead"]');
  await expect(customerHeading).toBeVisible();

  const quickSearchInput = page.locator("//span[normalize-space()='Customer Only']/ancestor::div[3]//input[@placeholder='Quick Search']");
  await page.waitForLoadState('domcontentloaded');
  await quickSearchInput.fill(testData.quickSearch);

  const customerCell = page.locator('td').filter({ hasText: testData.quickSearch }).first();
  await expect(customerCell).toBeVisible();
  await expect(customerCell).toBeEnabled();
  await page.waitForTimeout(4000);
  await customerCell.click();

  const unlinkButton = page.getByRole('button', { name: 'Unlink', exact: true });
  await expect(unlinkButton).toBeVisible();

  const continueCustomerPickerButton = page.getByRole('button', { name: 'Continue', exact: true }).first();
  await expect(continueCustomerPickerButton).toBeEnabled();
  await continueCustomerPickerButton.click();

  const selectedCustomerButton = page.getByRole('button', { name: testData.customerName, exact: true });
  await expect(selectedCustomerButton).toBeVisible();
  await expect(selectedCustomerButton).toBeEnabled();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(duplicateCheckTab).toBeVisible();

  const duplicateHeading = page.locator('h3').filter({ hasText: 'There are some possible duplicates' }).first();
  await expect(duplicateHeading).toBeVisible();

  const duplicateMessage = page.locator('p').filter({ hasText: 'Do you mean to use one of these opportunities?' }).first();
  await expect(duplicateMessage).toBeVisible();

  const noMatchesButton = page.getByRole('button', { name: 'No, there are no matches', exact: true });
  await expect(noMatchesButton).toBeVisible();
  await expect(noMatchesButton).toBeEnabled();
  await noMatchesButton.click();

  const infoCorrectHeading = page.locator('h3').filter({ hasText: 'Is all the information correct?' }).first();
  await expect(infoCorrectHeading).toBeVisible();

  const descriptionTerm = page.locator('dt').filter({ hasText: 'Description' }).first();
  await expect(descriptionTerm).toBeVisible();

  const customerIdTerm = page.locator('dt').filter({ hasText: 'Customer ID' }).first();
  await expect(customerIdTerm).toBeVisible();
  await expect(customerIdTerm).toBeEnabled();
  await customerIdTerm.click();

  const yesAddRecordButton = page.getByRole('button', { name: 'Yes, add record', exact: true });
  await expect(yesAddRecordButton).toBeVisible();
  await expect(yesAddRecordButton).toBeEnabled();
  await yesAddRecordButton.click();

  await page.waitForTimeout(3000);

  const opportunityInfoDiv = page.locator('div').filter({ hasText: 'Opportunity' }).first();
  await expect(opportunityInfoDiv).toBeVisible();

  // const createQuickQuoteLink = page.getByRole('link', { name: 'Create Quick Quote', exact: true }).first();
  // await expect(createQuickQuoteLink).toBeVisible();

  await expect(newOpportunityButton).toBeVisible();

  const requestForProposalHeading = page.locator('h3').filter({ hasText: 'Request for Proposal' }).first();
  await expect(requestForProposalHeading).toBeVisible();

  const customerNameShowpage = page.locator(
    "//span[contains(@class,'text-ellipsis') and contains(@x-tooltip.only-on-ellipsis.allowhtml,'-')]"
  ).first();
  const customerText = (await customerNameShowpage.innerText()).trim();
  const customerNameOnlyShowpage = customerText.split('-').slice(1).join('-').trim();
  console.log(`[data] Customer Name: ${customerNameOnlyShowpage}`);
  expect(customerNameOnlyShowpage.toLowerCase()).toContain(testData.quickSearch.toLowerCase());

  const nameInShowPage = page.locator(
    '//div[contains(text(),"Opportunity")][1]//following::div[normalize-space()="Name"]//following-sibling::div/span'
  );
  const nameInShowPageText = ((await nameInShowPage.textContent()) || '').trim();
  console.log(`[data] Name in Show Page: ${nameInShowPageText}`);
  expect(nameInShowPageText).toContain(firstOpportunityNameText);

  await customerMenuButton.click();
  await expect(opportunitiesLink).toBeVisible();
  await expect(opportunitiesLink).toBeEnabled();
  await opportunitiesLink.click();
  await page.waitForLoadState('domcontentloaded');

  const opportunityNames = page.locator('//tbody//tr//td[3]//div');
  const opportunityNamesArray = await opportunityNames.allTextContents();
  const matchingCount = opportunityNamesArray.filter(
    (name) => name.trim() === firstOpportunityNameText.trim()
  ).length;
  console.log(`[data] "${firstOpportunityNameText}" found ${matchingCount} times`);
  expect(matchingCount).toBeGreaterThan(1);

  // --- TC13: duplicate again → edit name → create with unique name ---
  await expect(newOpportunityButton).toBeEnabled();
  await newOpportunityButton.click();

  await expect(newOpportunityHeader).toBeVisible();

  await expect(formTab).toBeVisible();
  await expect(formTab).toBeEnabled();
  await formTab.click();

  await expect(previewTab).toBeVisible();
  await expect(previewTab).toBeEnabled();
  await previewTab.click();

  await expect(duplicateCheckTab).toBeVisible();
  await expect(duplicateCheckTab).toBeEnabled();
  await duplicateCheckTab.click();

  await expect(nameRequiredInput).toBeVisible();
  await expect(nameRequiredInput).toBeEditable();
  await nameRequiredInput.fill(firstOpportunityNameText);

  await expect(descriptionInput).toBeVisible();
  await expect(descriptionInput).toBeEditable();
  await descriptionInput.fill(testData.description);

  await expect(selectCustomerButton).toBeVisible();
  await expect(selectCustomerButton).toBeEnabled();
  await selectCustomerButton.click();

  await page.waitForLoadState('domcontentloaded');
  await quickSearchInput.fill(testData.quickSearch);

  await expect(customerCell).toBeVisible();
  await expect(customerCell).toBeEnabled();
  await page.waitForTimeout(4000);
  await customerCell.click();

  await expect(unlinkButton).toBeVisible();

  await expect(continueCustomerPickerButton).toBeEnabled();
  await continueCustomerPickerButton.click();

  await expect(selectedCustomerButton).toBeVisible();
  await expect(selectedCustomerButton).toBeEnabled();

  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(duplicateCheckTab).toBeVisible();
  await expect(duplicateHeading).toBeVisible();
  await expect(duplicateMessage).toBeVisible();

  await expect(noMatchesButton).toBeVisible();
  await expect(noMatchesButton).toBeEnabled();
  await noMatchesButton.click();

  await expect(infoCorrectHeading).toBeVisible();
  await expect(descriptionTerm).toBeVisible();
  await expect(customerIdTerm).toBeVisible();

  const editButton = page.locator('//p[normalize-space()="No, I need to edit"]');
  await expect(editButton).toBeVisible();
  await expect(editButton).toBeEnabled();
  await editButton.click();

  await nameRequiredInput.clear();
  await nameRequiredInput.fill(session.opportunityName);

  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(duplicateHeading).not.toBeVisible();

  await expect(yesAddRecordButton).toBeVisible();
  await expect(yesAddRecordButton).toBeEnabled();
  await yesAddRecordButton.click();

  await expect(opportunityInfoDiv).toBeVisible();

});
