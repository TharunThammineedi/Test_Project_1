import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');
const { prepareSession } = require('../../helpers/sessionData');

test('Creation of Draft RFP @regression', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  // 1. Go to login page
  await page.goto(testData.url);
  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'email field', 'visible', null,
    () => page.locator('input[name="email"][type="email"]'));
  await heal(page, 'email field', 'fill', testData.email,
    () => page.locator('input[name="email"][type="email"]'));

  await heal(page, 'password field', 'visible', null,
    () => page.locator('input[name="password"][type="password"]'));
  await heal(page, 'password field', 'fill', testData.password,
    () => page.locator('input[name="password"][type="password"]'));

  await heal(page, 'sign in confirm button', 'click', null,
    () => page.locator('[data-cy="btnLoginConfirm"]'));

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'rfp menu link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'rfp menu link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'new rfp link', 'visible', null,
    () => page.getByRole('link', { name: 'New Request for Proposal', exact: true }));
  await heal(page, 'new rfp link', 'click', null,
    () => page.getByRole('link', { name: 'New Request for Proposal', exact: true }));

  await heal(page, 'select customer button', 'click', null,
    () => page.getByRole('button', { name: 'Select Customer', exact: true }));

  await heal(page, 'quick search field', 'visible', null,
    () => page.getByPlaceholder('Quick Search'));
  await heal(page, 'quick search field', 'fill', testData.quickSearch,
    () => page.getByPlaceholder('Quick Search'));

  await heal(page, 'customer cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^Charles Lecrec$/ }).first());
  await heal(page, 'customer cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^Charles Lecrec$/ }).first());

  await heal(page, 'customer div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Charles Lecrec$/ }).first());
  await heal(page, 'customer div', 'click', null,
    () => page.locator('div').filter({ hasText: /^Charles Lecrec$/ }).first());

  await heal(page, 'unlink button', 'visible', null,
    () => page.getByRole('button', { name: 'Unlink', exact: true }));
  await heal(page, 'cancel button', 'visible', null,
    () => page.getByRole('button', { name: 'Cancel', exact: true }));

  await heal(page, 'continue customer button', 'click', null,
    () => page.getByRole('button', { name: 'Continue', exact: true }));

  await heal(page, 'add contact button', 'click', null,
    () => page.getByRole('button', { name: 'Add Contact', exact: true }));

  await heal(page, 'first name field', 'visible', null,
    () => page.locator('input[name="contact.first_name"][type="text"]'));
  await heal(page, 'first name field', 'fill', testData.firstNameRequired,
    () => page.locator('input[name="contact.first_name"][type="text"]'));

  await heal(page, 'last name field', 'visible', null,
    () => page.locator('input[name="contact.last_name"][type="text"]'));
  await heal(page, 'last name field', 'fill', testData.lastNameRequired,
    () => page.locator('input[name="contact.last_name"][type="text"]'));

  await heal(page, 'step 2 check div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^STEP 2 Check$/ }).first());
  await heal(page, 'step 2 check div', 'click', null,
    () => page.locator('div').filter({ hasText: /^STEP 2 Check$/ }).first());

  await heal(page, 'step 3 preview div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^STEP 3 Preview$/ }).first());
  await heal(page, 'step 3 preview div', 'click', null,
    () => page.locator('div').filter({ hasText: /^STEP 3 Preview$/ }).first());

  await heal(page, 'continue contact button', 'click', null,
    () => page.getByRole('button', { name: 'Continue', exact: true }));

  await heal(page, 'no matches button', 'visible', null,
    () => page.getByRole('button', { name: 'No, there are no matches', exact: true }));
  await heal(page, 'no matches button', 'click', null,
    () => page.getByRole('button', { name: 'No, there are no matches', exact: true }));

  await heal(page, 'no edit button', 'visible', null,
    () => page.getByRole('button', { name: 'No, I Need To Edit', exact: true }));
  await heal(page, 'no edit button', 'click', null,
    () => page.getByRole('button', { name: 'No, I Need To Edit', exact: true }));

  await heal(page, 'yes add record button', 'click', null,
    () => page.getByRole('button', { name: 'Yes, add record', exact: true }));

  await heal(page, 'project radio', 'visible', null,
    () => page.locator('#projectselect'));
  await heal(page, 'project radio', 'check', null,
    () => page.locator('#projectselect'));

  await heal(page, 'opportunity name field', 'visible', null,
    () => page.locator('input[name="project.name"][type="text"]'));
  await heal(page, 'opportunity name field', 'fill', testData.nameRequired,
    () => page.locator('input[name="project.name"][type="text"]'));

  await heal(page, 'opportunity description field', 'visible', null,
    () => page.locator('input[name="project.description"][type="text"]'));
  await heal(page, 'opportunity description field', 'fill', testData.description,
    () => page.locator('input[name="project.description"][type="text"]'));

  await heal(page, 'pricing table presets fieldset', 'visible', null,
    () => page.locator('fieldset').filter({ hasText: /^Pricing Table Presets Sales Unit \* Quantity Breaks \*$/ }).first());
  await heal(page, 'pricing table presets fieldset', 'click', null,
    () => page.locator('fieldset').filter({ hasText: /^Pricing Table Presets Sales Unit \* Quantity Breaks \*$/ }).first());

  await heal(page, 'sales unit field', 'visible', null,
    () => page.locator('input[name="estimate.quantity_unit_id"][type="text"]'));
  await heal(page, 'sales unit field', 'click', null,
    () => page.locator('input[name="estimate.quantity_unit_id"][type="text"]'));
  await heal(page, 'feet option', 'visible', null,
    () => page.locator('li[data-label="Feet"]'));
  await heal(page, 'feet option', 'click', null,
    () => page.locator('li[data-label="Feet"]'));

  await heal(page, 'quantity break 1 field', 'visible', null,
    () => page.locator('input[name="estimate.quantity_break_1"][type="text"]'));
  await heal(page, 'quantity break 1 field', 'fill', testData.quantityBreak1,
    () => page.locator('input[name="estimate.quantity_break_1"][type="text"]'));

  await heal(page, 'quoting options fieldset', 'visible', null,
    () => page.locator('fieldset').filter({ hasText: /^Quoting Options Number of SKUs \(Product Items\) \* Max Number of Colors to Quote \*$/ }).first());
  await heal(page, 'quoting options fieldset', 'click', null,
    () => page.locator('fieldset').filter({ hasText: /^Quoting Options Number of SKUs \(Product Items\) \* Max Number of Colors to Quote \*$/ }).first());

  await heal(page, 'number of skus field', 'visible', null,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));
  await heal(page, 'number of skus field', 'fill', testData.numberOfSKUsProductItems,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));

  await heal(page, 'max colors field', 'visible', null,
    () => page.locator('input[name="estimate.max_colors_to_quote"][type="text"]'));
  await heal(page, 'max colors field', 'click', null,
    () => page.locator('input[name="estimate.max_colors_to_quote"][type="text"]'));
  await heal(page, 'six colors option', 'visible', null,
    () => page.locator('li[data-label="6"]'));
  await heal(page, 'six colors option', 'click', null,
    () => page.locator('li[data-label="6"]'));

  await heal(page, 'number of skus field', 'fill', testData.numberOfSKUsProductItems,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));

  await heal(page, 'general information div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^General Information$/ }).first());
  await heal(page, 'general information div', 'click', null,
    () => page.locator('div').filter({ hasText: /^General Information$/ }).first());

  await heal(page, 'product class field', 'visible', null,
    () => page.locator('input[name="estimate.product_class_id"][type="text"]'));
  await heal(page, 'product class field', 'click', null,
    () => page.locator('input[name="estimate.product_class_id"][type="text"]'));
  await heal(page, 'rfid label option', 'visible', null,
    () => page.locator('li[data-label="RFID Label"]'));
  await heal(page, 'rfid label option', 'click', null,
    () => page.locator('li[data-label="RFID Label"]'));

  await heal(page, 'workflow field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.workflowId"][type="text"]'));
  await heal(page, 'workflow field', 'click', null,
    () => page.locator('input[name="estimateSpecification.workflowId"][type="text"]'));
  await heal(page, 'rfid workflow option', 'visible', null,
    () => page.locator('li[data-label="RFID Digital Workflow"]'));
  await heal(page, 'rfid workflow option', 'click', null,
    () => page.locator('li[data-label="RFID Digital Workflow"]'));

  await heal(page, 'plant field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.plantId"][type="text"]'));
  await heal(page, 'plant field', 'click', null,
    () => page.locator('input[name="estimateSpecification.plantId"][type="text"]'));
  await heal(page, 'fortis option', 'visible', null,
    () => page.locator('li[data-label="Fortis (99)"]'));
  await heal(page, 'fortis option', 'click', null,
    () => page.locator('li[data-label="Fortis (99)"]'));

  await heal(page, 'estimate description textarea', 'visible', null,
    () => page.locator('#estimate.description'));
  await heal(page, 'estimate description textarea', 'click', null,
    () => page.locator('#estimate.description'));
  await heal(page, 'estimate description textarea', 'fill', testData.descriptionRequired,
    () => page.locator('#estimate.description'));

  await heal(page, 'unit set field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.unitSetTypeId"][type="text"]'));
  await heal(page, 'unit set field', 'click', null,
    () => page.locator('input[name="estimateSpecification.unitSetTypeId"][type="text"]'));
  await heal(page, 'roll option', 'visible', null,
    () => page.locator('li[data-label="Roll"]'));
  await heal(page, 'roll option', 'click', null,
    () => page.locator('li[data-label="Roll"]'));

  await heal(page, 'core diameter field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.coreDiameterId"][type="text"]'));
  await heal(page, 'core diameter field', 'click', null,
    () => page.locator('input[name="estimateSpecification.coreDiameterId"][type="text"]'));
  await heal(page, 'one inch option', 'visible', null,
    () => page.locator('li[data-label="1"]'));
  await heal(page, 'one inch option', 'click', null,
    () => page.locator('li[data-label="1"]'));

  await heal(page, 'application temp field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.applicationTemp"][type="text"]'));
  await heal(page, 'application temp field', 'fill', testData.applicationTempRequired,
    () => page.locator('input[name="estimateSpecification.applicationTemp"][type="text"]'));

  await heal(page, 'surface type field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.applicationSurfaceTypeValuelistOptionId"][type="text"]'));
  await heal(page, 'surface type field', 'click', null,
    () => page.locator('input[name="estimateSpecification.applicationSurfaceTypeValuelistOptionId"][type="text"]'));
  await heal(page, 'glass option', 'visible', null,
    () => page.locator('li[data-label="Glass"]'));
  await heal(page, 'glass option', 'click', null,
    () => page.locator('li[data-label="Glass"]'));

  await heal(page, 'surface temp after field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.surfaceTempAfterApplication"][type="text"]'));
  await heal(page, 'surface temp after field', 'fill', testData.surfaceTempAfter,
    () => page.locator('input[name="estimateSpecification.surfaceTempAfterApplication"][type="text"]'));

  await heal(page, 'substrate info fieldset', 'visible', null,
    () => page.locator('fieldset').filter({ hasText: /^Generic Substrate Information Appearance \(Color\) \* Substrate \(Face or Facestock\) \* Adhesive \* Liner$/ }).first());
  await heal(page, 'substrate info fieldset', 'click', null,
    () => page.locator('fieldset').filter({ hasText: /^Generic Substrate Information Appearance \(Color\) \* Substrate \(Face or Facestock\) \* Adhesive \* Liner$/ }).first());

  await heal(page, 'appearance color field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.substrateColor"][type="text"]'));
  await heal(page, 'appearance color field', 'fill', testData.appearanceColorRequired,
    () => page.locator('input[name="estimateSpecification.substrateColor"][type="text"]'));

  await heal(page, 'substrate face field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.substrateFace"][type="text"]'));
  await heal(page, 'substrate face field', 'fill', testData.substrateFaceOrFacestock,
    () => page.locator('input[name="estimateSpecification.substrateFace"][type="text"]'));

  await heal(page, 'adhesive field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.substrateAdhesive"][type="text"]'));
  await heal(page, 'adhesive field', 'fill', testData.adhesiveRequired,
    () => page.locator('input[name="estimateSpecification.substrateAdhesive"][type="text"]'));

  await heal(page, 'liner field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.substrateLiner"][type="text"]'));
  await heal(page, 'liner field', 'fill', testData.adhesiveRequired,
    () => page.locator('input[name="estimateSpecification.substrateLiner"][type="text"]'));

  await heal(page, 'coating field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.coatingTypeValuelistOptionId"][type="text"]'));
  await heal(page, 'coating field', 'click', null,
    () => page.locator('input[name="estimateSpecification.coatingTypeValuelistOptionId"][type="text"]'));
  await heal(page, 'uv gloss option', 'visible', null,
    () => page.locator('li[data-label="UV Gloss"]'));
  await heal(page, 'uv gloss option', 'click', null,
    () => page.locator('li[data-label="UV Gloss"]'));

  await heal(page, 'laminate field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.laminateTypeValuelistOptionId"][type="text"]'));
  await heal(page, 'laminate field', 'click', null,
    () => page.locator('input[name="estimateSpecification.laminateTypeValuelistOptionId"][type="text"]'));
  await heal(page, 'ul laminate option', 'visible', null,
    () => page.locator('li[data-label="UL Laminate"]'));
  await heal(page, 'ul laminate option', 'click', null,
    () => page.locator('li[data-label="UL Laminate"]'));

  await heal(page, 'wind direction field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.windDirectionId"][type="text"]'));
  await heal(page, 'wind direction field', 'click', null,
    () => page.locator('input[name="estimateSpecification.windDirectionId"][type="text"]'));
  await heal(page, 'left first option', 'visible', null,
    () => page.locator('li[data-label="4 - Print out, Left first."]'));
  await heal(page, 'left first option', 'click', null,
    () => page.locator('li[data-label="4 - Print out, Left first."]'));

  await heal(page, 'create draft button', 'visible', null,
    () => page.getByRole('button', { name: 'Create Draft Request For Proposal', exact: true }));
  await heal(page, 'create request button', 'visible', null,
    () => page.getByRole('button', { name: 'Create Request for Proposal', exact: true }));

  await heal(page, 'create draft button', 'click', null,
    () => page.getByRole('button', { name: 'Create Draft Request For Proposal', exact: true }));

  await heal(page, 'rfp success div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Request for Proposal created successfully\. Close$/ }).first());

  await heal(page, 'status draft div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Status Draft$/ }).first());
});