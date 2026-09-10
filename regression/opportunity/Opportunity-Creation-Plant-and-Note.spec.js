// Create Opportunity with plant and note, plus invalid empty-name case
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test.describe('Opportunity Creation @regression', () => {
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

  test('Creation of Opportunity with plant and note @regression', async () => {
    test.setTimeout(720000);
    const session = prepareSession({ force: true });
    Object.assign(testData, session);
    console.log(`[data] Creation override → opportunityName: ${session.opportunityName}`);

    const btn = page.locator('(//button[normalize-space()="Customer"])[1]');
    await btn.click();

    const opportunitiesLink = page.getByRole('link', { name: 'Opportunities', exact: true });
    await expect(opportunitiesLink).toBeVisible();
    await expect(opportunitiesLink).toBeEnabled();
    await opportunitiesLink.click();

    await page.waitForLoadState('domcontentloaded');

    const newOpportunityButton = page.getByRole('button', { name: 'New Opportunity', exact: true });
    await expect(newOpportunityButton).toBeEnabled();
    await newOpportunityButton.click();

    const nameRequiredInput = page.locator('input[name="project.name"][type="text"]');
    await expect(nameRequiredInput).toBeVisible();
    await expect(nameRequiredInput).toBeEditable();
    await nameRequiredInput.fill(session.opportunityName);

    const newOpportunityHeading = page.locator('h2').filter({ hasText: /^New Opportunity$/ }).first();
    await expect(newOpportunityHeading).toBeVisible();

    const formTab = page.locator('div').filter({ hasText: /^Form$/ }).first();
    await expect(formTab).toBeVisible();
    await expect(formTab).toBeEnabled();
    await formTab.click();

    const duplicateCheckTab = page.locator('div').filter({ hasText: /^Duplicate check$/ }).first();
    await expect(duplicateCheckTab).toBeVisible();
    await expect(duplicateCheckTab).toBeEnabled();
    await duplicateCheckTab.click();

    const previewTab = page.locator('div').filter({ hasText: /^Preview$/ }).first();
    await expect(previewTab).toBeVisible();
    await expect(previewTab).toBeEnabled();
    await previewTab.click();

    const selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
    await expect(selectCustomerButton).toBeVisible();

    const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(duplicateCheckTab).toBeVisible();

    const yesAddRecordButton = page.getByRole('button', { name: 'Yes, add record', exact: true });
    await expect(yesAddRecordButton).toBeEnabled();
    await yesAddRecordButton.click();

    await page.waitForLoadState('domcontentloaded');

    // Add plant on the opportunity just created
    const createdOpportunityRow = page.getByText(session.opportunityName, { exact: true }).first();
    await expect(createdOpportunityRow).toBeVisible();
    await createdOpportunityRow.click();

    const editButton = page.locator('(//button[@x-tooltip="Edit"])[1]');
    await expect(editButton).toBeVisible();
    await expect(editButton).toBeEnabled();
    await editButton.click();

    const selectPlantButton = page.getByRole('button', { name: 'Select Plant', exact: true });
    if (await selectPlantButton.isVisible()) {
      await expect(selectPlantButton).toBeEnabled();
      await selectPlantButton.click();
    } else {
      const changePlantButton = page.locator('(//div[normalize-space()="Plant"]//following-sibling::div)[2]');
      await expect(changePlantButton).toBeVisible();
      await changePlantButton.click();
    }

    const pasoRoblesRadio = page.locator('input[name="selectedId"][type="radio"][value="29"]');
    await expect(pasoRoblesRadio).toBeVisible();
    await pasoRoblesRadio.check();
    await expect(pasoRoblesRadio).toBeChecked();

    const pasoRoblesLabel = page.locator('label').filter({ hasText: 'Paso Robles, CA' }).first();
    await expect(pasoRoblesLabel).toBeVisible();
    await expect(pasoRoblesLabel).toBeEnabled();
    await pasoRoblesLabel.click();

    const plantContinueButton = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(plantContinueButton).toBeEnabled();
    await plantContinueButton.click();

    const saveButton = page.locator('button[x-tooltip="Save"]').first();
    await expect(saveButton).toBeVisible();

    const cancelButton = page.locator('button[x-tooltip="Cancel"]').first();
    await expect(cancelButton).toBeVisible();

    await saveButton.click();

    await expect(editButton).toBeVisible();

    const pasoRoblesSummaryText = page.locator('span').filter({ hasText: 'Paso Robles, CA (33)' }).first();
    await expect(pasoRoblesSummaryText).toBeVisible();

    // Add note on the same opportunity
    const newNoteButton = page.getByRole('button', { name: 'New Note', exact: true }).first();
    await expect(newNoteButton).toBeEnabled();
    await newNoteButton.click();

    const noteEditor = page.locator('.ql-editor').first();
    await expect(noteEditor).toBeVisible();
    await expect(noteEditor).toBeEditable();
    await noteEditor.fill(testData.awaitPageLocatorQlEditorFill);

    const saveNoteButton = page.locator('button[x-tooltip="Save"][wire\\:click="create"]');
    await expect(saveNoteButton).toBeEnabled();
    await saveNoteButton.scrollIntoViewIfNeeded();
    await saveNoteButton.click({ force: true });

    const noteAuthor = page.locator('div').filter({ hasText: 'Ranga Sharan Rohith' }).first();
    await expect(noteAuthor).toBeVisible();

    const noteContent = page.locator('div').filter({ hasText: testData.awaitPageLocatorQlEditorFill }).first();
    await expect(noteContent).toBeVisible();
  });

  test('Opportunity creation with invalid data @regression', async () => {
    const btn = page.locator('(//button[normalize-space()="Customer"])[1]');
    await btn.click();

    const opportunitiesLink = page.getByRole('link', { name: 'Opportunities', exact: true });
    await expect(opportunitiesLink).toBeVisible();
    await expect(opportunitiesLink).toBeEnabled();
    await opportunitiesLink.click();

    const newOpportunityButton = page.getByRole('button', { name: 'New Opportunity', exact: true });
    await expect(newOpportunityButton).toBeEnabled();
    await newOpportunityButton.click();

    const newOpportunityHeading = page.locator('h2').filter({ hasText: /^New Opportunity$/ }).first();
    await expect(newOpportunityHeading).toBeVisible();

    const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    const nameFieldRequiredAlert = page.getByText('The name field is required.', { exact: true });
    await expect(nameFieldRequiredAlert).toBeVisible();
  });
});
