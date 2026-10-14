// Validate, add, link, and remove contacts on an Opportunity
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Validate add link and remove Opportunity contacts @regression @set1', async ({ page }) => {
  test.setTimeout(720000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);

  const contactName = `${testData.firstNameRequired} ${testData.lastNameRequired}`;
  const contactEmail = `${testData.firstNameRequired}.${testData.lastNameRequired}@example.com`.replace(/[^a-zA-Z0-9.@]/g, '').toLowerCase();
  console.log(`[data] contactName: ${contactName}`);

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

  const mineFilter = page.locator('//span[normalize-space()="Mine"]//following::button[1]');
  await expect(mineFilter).toBeVisible();
  await mineFilter.click();
  await page.waitForTimeout(2000);

  const quickSearchInput = page.getByPlaceholder('Quick Search').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();
  await quickSearchInput.fill(testData.quickSearch);
  await page.waitForTimeout(2000);

  const opportunityRow = page.locator('//tbody//tr[1]');
  await expect(opportunityRow).toBeVisible();
  await expect(opportunityRow).toContainText(testData.customerName);

  const oppCell = page.locator('//tbody//tr[1]//td[2]');
  await expect(oppCell).toBeVisible();
  const opportunityNumber = (await oppCell.innerText()).trim();
  console.log(`[data] opportunityNumber: ${opportunityNumber}`);
  await oppCell.click();
  await page.waitForTimeout(2000);

  const oppHeading = page.locator('div').filter({ hasText: `${opportunityNumber} - Opportunity` }).first();
  await expect(oppHeading).toBeVisible();

  const customerLead = page.locator('//div[normalize-space()="Customer/Lead"]/following-sibling::div').first();
  await expect(customerLead).toBeVisible();
  await expect(customerLead).toContainText(testData.customerCode);
  await expect(customerLead).toContainText(testData.customerName);

  // --- Validate Contacts: open Customer in a new tab and compare contacts ---
  const customerArrow = page.locator('//div[normalize-space()="Customer/Lead"]/following-sibling::div//a[.//div[@x-tooltip="Open"]]').first();
  await expect(customerArrow).toBeVisible();
  const [customerPage] = await Promise.all([
    page.context().waitForEvent('page'),
    customerArrow.click({ modifiers: ['Control'] }),
  ]);
  await customerPage.waitForLoadState('domcontentloaded');
  await expect(customerPage).toHaveURL(/\/customers\//);
  await expect(customerPage.getByText(testData.customerCode).first()).toBeVisible();

  await customerPage.mouse.wheel(0, 2000);
  await customerPage.waitForTimeout(1000);
  await customerPage.mouse.wheel(0, 2000);
  await customerPage.waitForTimeout(1000);
  await customerPage.mouse.wheel(0, 2000);
  await customerPage.waitForTimeout(1000);

  const customerContactsHeading = customerPage.locator('//h3[normalize-space()="Contacts"]');
  await customerContactsHeading.scrollIntoViewIfNeeded();
  await expect(customerContactsHeading).toBeVisible();

  const customerViewAllButton = customerPage.locator('//h3[normalize-space()="Contacts"]/following::*[@data-cy="view-all"][1]');
  await expect(customerViewAllButton).toBeVisible();
  if (await customerViewAllButton.isEnabled()) {
    await customerViewAllButton.click();
    await customerPage.waitForTimeout(2000);
  }

  const customerContactCells = customerPage.locator('//h3[normalize-space()="Contacts"]/following::div[contains(@class,"flex row")][.//button[@x-tooltip="Remove"]]//div[contains(@class,"text-ellipsis")]');
  const customerContactNames = (await customerContactCells.allTextContents()).map((name) => name.trim());
  console.log(`[data] customerContactCount: ${customerContactNames.length}`);
  expect(customerContactNames.length).toBeGreaterThan(0);

  await page.bringToFront();
  await expect(oppHeading).toBeVisible();

  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(1000);

  const contactsHeading = page.locator('//h3[normalize-space()="Contacts"]');
  await contactsHeading.scrollIntoViewIfNeeded();
  await expect(contactsHeading).toBeVisible();

  const viewAllButton = page.locator('//h3[normalize-space()="Contacts"]/following::*[@data-cy="view-all"][1]');
  await expect(viewAllButton).toBeVisible();
  if (await viewAllButton.isEnabled()) {
    await viewAllButton.click();
    await page.waitForTimeout(2000);
  }

  const opportunityContactCells = page.locator('//h3[normalize-space()="Contacts"]/following::div[contains(@class,"flex row")][.//button[@x-tooltip="Remove"]]//div[contains(@class,"text-ellipsis")]');
  const opportunityContactNames = (await opportunityContactCells.allTextContents()).map((name) => name.trim());
  console.log(`[data] opportunityContactCount: ${opportunityContactNames.length}`);
  expect(opportunityContactNames.length).toBeGreaterThan(0);

  for (const customerContactName of customerContactNames) {
    expect(opportunityContactNames).toContain(customerContactName);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // --- Add a new contact ---
  const addContactButton = page.getByRole('button', { name: 'Add Contact', exact: true });
  await addContactButton.scrollIntoViewIfNeeded();
  await expect(addContactButton).toBeEnabled();
  await addContactButton.click();

  const addContactHeading = page.locator('//h2[normalize-space()="Add Customer Contact"]');
  await expect(addContactHeading).toBeVisible();

  const firstNameInput = page.locator('#card-create input[name="contact.first_name"]');
  await expect(firstNameInput).toBeVisible();
  await expect(firstNameInput).toBeEditable();
  await firstNameInput.fill(testData.firstNameRequired);

  const lastNameInput = page.locator('#card-create input[name="contact.last_name"]');
  await expect(lastNameInput).toBeVisible();
  await expect(lastNameInput).toBeEditable();
  await lastNameInput.fill(testData.lastNameRequired);

  const contactEmailInput = page.locator('#card-create input[name="contact.email"]');
  await expect(contactEmailInput).toBeEditable();
  await contactEmailInput.fill(contactEmail);

  const titleInput = page.locator('#card-create input[name="contact.title"]');
  await expect(titleInput).toBeEditable();
  await titleInput.fill('Purchasing');

  const workPhoneInput = page.locator('#card-create input[name="contact.work_phone"]');
  await expect(workPhoneInput).toBeEditable();
  await workPhoneInput.fill('7575550101');

  const officePhoneInput = page.locator('#card-create input[name="contact.office_phone"]');
  await expect(officePhoneInput).toBeEditable();
  await officePhoneInput.fill('7575550102');

  const mobilePhoneInput = page.locator('#card-create input[name="contact.mobile_phone"]');
  await expect(mobilePhoneInput).toBeEditable();
  await mobilePhoneInput.fill('7575550103');

  const faxInput = page.locator('#card-create input[name="contact.fax"]');
  await expect(faxInput).toBeEditable();
  await faxInput.fill('7575550104');

  const continueContactButton = page.locator('#card-create').getByRole('button', { name: 'Continue', exact: true });
  await expect(continueContactButton).toBeEnabled();
  await continueContactButton.click();
  await page.waitForTimeout(2000);

  const noMatchesButton = page.getByRole('button', { name: 'No, there are no matches', exact: true });
  const yesAddRecordButton = page.getByRole('button', { name: 'Yes, add record', exact: true });
  if (await yesAddRecordButton.isVisible()) {
    await yesAddRecordButton.click();
  } else {
    await noMatchesButton.click();
    await expect(yesAddRecordButton).toBeVisible();
    await yesAddRecordButton.click();
  }

  await expect(addContactHeading).toBeHidden();
  await expect(page).toHaveURL(/\/projects\//);
  await expect(oppHeading).toBeVisible();

  const addedContact = page.locator('div.text-ellipsis').filter({ hasText: contactName }).first();
  await addedContact.scrollIntoViewIfNeeded();
  await expect(addedContact).toBeVisible();

  // --- Link a contact ---
  const linkContactButton = page.getByRole('button', { name: 'Link Contact', exact: true });
  await expect(linkContactButton).toBeVisible();
  await expect(linkContactButton).toBeEnabled();
  await linkContactButton.click();

  const chooseContactHeading = page.locator('//h3[normalize-space()="Choose Contact"]');
  await expect(chooseContactHeading).toBeVisible();

  const addedContactCheckbox = page.locator(`//h3[normalize-space()="Choose Contact"]/following::tbody[1]//tr[contains(normalize-space(),"${contactName}")]//input[@type="checkbox"]`).first();
  await expect(addedContactCheckbox).toBeVisible();
  await expect(addedContactCheckbox).toBeChecked();

  const unlinkedContactRow = page.locator('//h3[normalize-space()="Choose Contact"]/following::tbody[1]//tr')
    .filter({ has: page.locator('input[type="checkbox"]:not(:checked)') })
    .first();
  await expect(unlinkedContactRow).toBeVisible();
  const linkedContactName = (await unlinkedContactRow.innerText()).trim().split('\n')[0].trim();
  console.log(`[data] linkedContactName: ${linkedContactName}`);
  expect(opportunityContactNames).not.toContain(linkedContactName);

  const unlinkedContactCheckbox = page.locator(`//h3[normalize-space()="Choose Contact"]/following::tbody[1]//tr[contains(normalize-space(),"${linkedContactName}")]//input[@type="checkbox"]`).first();
  await expect(unlinkedContactCheckbox).not.toBeChecked();
  await unlinkedContactCheckbox.click();
  await expect(unlinkedContactCheckbox).toBeChecked();

  const pickerContinueButton = page.locator('//h3[normalize-space()="Choose Contact"]/following::button[normalize-space()="Continue"][1]');
  await expect(pickerContinueButton).toBeEnabled();
  await pickerContinueButton.click();

  await expect(chooseContactHeading).toBeHidden();
  await expect(page).toHaveURL(/\/projects\//);
  await expect(oppHeading).toBeVisible();

  const linkedContact = page.locator('div.text-ellipsis').filter({ hasText: linkedContactName }).first();
  await linkedContact.scrollIntoViewIfNeeded();
  await expect(linkedContact).toBeVisible();

  // --- Remove a contact ---
  const linkedContactRow = page.locator(`//div[contains(@class,"flex row")][.//div[contains(@class,"text-ellipsis") and normalize-space()="${linkedContactName}"]]`).first();
  await linkedContactRow.hover();
  const removeLinkedContactButton = linkedContactRow.locator('button[x-tooltip="Remove"]');
  await expect(removeLinkedContactButton).toBeVisible();
  await removeLinkedContactButton.click();

  const removeContactDialog = page.locator('//h3[text()="Remove Contact"]').first();
  await expect(removeContactDialog).toBeVisible();
  await expect(page.getByText('Are you sure you want to remove Contact from Project').first()).toBeVisible();

  const confirmButton = page.locator('[data-cy="confirm"]');
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  const removalMessage = page.getByText('Contact removed from Project successfully.', { exact: true }).first();
  await expect(removalMessage).toBeVisible();

  await expect(page).toHaveURL(/\/projects\//);
  await expect(oppHeading).toBeVisible();
  await expect(page.locator('div.text-ellipsis').filter({ hasText: linkedContactName })).toHaveCount(0);
  await expect(addedContact).toBeVisible();

  // --- Cleanup: unlink the added contact so the reused opportunity stays clean ---
  const addedContactRow = page.locator(`//div[contains(@class,"flex row")][.//div[contains(@class,"text-ellipsis") and normalize-space()="${contactName}"]]`).first();
  await addedContactRow.hover();
  const removeAddedContactButton = addedContactRow.locator('button[x-tooltip="Remove"]');
  await expect(removeAddedContactButton).toBeVisible();
  await removeAddedContactButton.click();

  await expect(removeContactDialog).toBeVisible();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
  await page.waitForTimeout(2000);

  await expect(page.locator('div.text-ellipsis').filter({ hasText: contactName })).toHaveCount(0);
});
