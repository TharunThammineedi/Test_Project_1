// Edit an existing Opportunity's General Information, then confirm the values after save and refresh
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Edit Opportunity general information @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] opportunityName: ${session.opportunityName}`);
  console.log(`[data] projectDescription: ${session.projectDescription}`);

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
  await expect(customerMenuButton).toBeVisible();
  await customerMenuButton.click();

  const opportunitiesLink = page.getByRole('link', { name: 'Opportunities', exact: true });
  await expect(opportunitiesLink).toBeVisible();
  await expect(opportunitiesLink).toBeEnabled();
  await opportunitiesLink.click();
  await page.waitForLoadState('domcontentloaded');

  const opportunitiesHeading = page.locator('label').filter({ hasText: 'Opportunities' }).first();
  await expect(opportunitiesHeading).toBeVisible();

  const newOpportunityButton = page.getByRole('button', { name: 'New Opportunity', exact: true });
  await expect(newOpportunityButton).toBeVisible();

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeEnabled();
  await filtersButton.click();

  const columnSelect = page.locator('select').first();
  await columnSelect.selectOption({ value: 'projectManager' });

  const operatorSelect = page.locator('select').nth(1);
  await operatorSelect.selectOption({ value: '=' });

  const valueInput = page.getByPlaceholder('value').first();
  await expect(valueInput).toBeVisible();
  await expect(valueInput).toBeEditable();
  await valueInput.fill(testData.userPicker);

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();
  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

  const oppCell = page.locator('//tbody//tr//td').filter({ hasText: /OPP\d+/ }).first();
  await expect(oppCell).toBeVisible();
  await expect(oppCell).toBeEnabled();
  const opportunityNumber = ((await oppCell.innerText()) || '').match(/OPP\d+/)[0];
  console.log(`[data] opportunityNumber: ${opportunityNumber}`);
  await oppCell.click();
  await page.waitForTimeout(2000);

  const oppHeading = page.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first();
  await expect(oppHeading).toBeVisible();

  const opportunityManagerDiv = page.locator('div').filter({ hasText: `Opportunity Manager ${testData.userPicker}` }).first();
  await expect(opportunityManagerDiv).toBeVisible();

  const editButton = page.locator('(//button[@x-tooltip="Edit"])[1]');
  await expect(editButton).toBeVisible();
  await expect(editButton).toBeEnabled();
  await editButton.click();

  const projectNameInput = page.locator('input[name="project.name"][type="text"]').last();
  await expect(projectNameInput).toBeVisible();
  await expect(projectNameInput).toBeEditable();
  await projectNameInput.clear();
  await expect(projectNameInput).toHaveValue('');
  await projectNameInput.fill(session.opportunityName);
  await expect(projectNameInput).toHaveValue(session.opportunityName);

  const projectDescriptionTextarea = page.locator('textarea[name="project.description"]').last();
  await expect(projectDescriptionTextarea).toBeVisible();
  await expect(projectDescriptionTextarea).toBeEditable();
  await projectDescriptionTextarea.clear();
  await expect(projectDescriptionTextarea).toHaveValue('');
  await projectDescriptionTextarea.fill(session.projectDescription);
  await expect(projectDescriptionTextarea).toHaveValue(session.projectDescription);

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
  await pasoRoblesLabel.click();

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  const saveButton = page.locator('button[x-tooltip="Save"]').first();
  await expect(saveButton).toBeVisible();
  await expect(saveButton).toBeEnabled();
  await saveButton.scrollIntoViewIfNeeded();
  await saveButton.click({ force: true });

  const updatedMessage = page.locator('p').filter({ hasText: 'updated successfully.' }).first();
  await expect(updatedMessage).toBeVisible();
   await page.waitForTimeout(2000);
  await expect(editButton).toBeVisible();

  const nameValue = page.locator('//div[normalize-space()="Name"]/following-sibling::div').first();
  await expect(nameValue).toContainText(session.opportunityName);

  const descriptionValue = page.locator('//div[normalize-space()="Description"]/following-sibling::div').first();
  await expect(descriptionValue).toContainText(session.projectDescription);

  const plantValue = page.locator('span').filter({ hasText: 'Paso Robles, CA (33)' }).first();
  await expect(plantValue).toBeVisible();

  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  await expect(page.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first()).toBeVisible();
  await expect(page.locator('//div[normalize-space()="Name"]/following-sibling::div').first()).toContainText(session.opportunityName);
  await expect(page.locator('//div[normalize-space()="Description"]/following-sibling::div').first()).toContainText(session.projectDescription);
  await expect(page.locator('span').filter({ hasText: 'Paso Robles, CA (33)' }).first()).toBeVisible();
});
