import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Edit Specification Sections After RFP Creation @regression', async ({ page }) => {
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

  await heal(page, 'login confirm button', 'click', null,
    () => page.locator('[data-cy="btnLoginConfirm"]'));

  // This is a menu open, keep as per codegen/trace

  await heal(page, 'rfp menu link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'rfp menu link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'mine filter', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Mine$/ }).first());
  await heal(page, 'mine filter', 'click', null,
    () => page.locator('div').filter({ hasText: /^Mine$/ }).first());

  await heal(page, 'rfp2929 cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^RFP2929$/ }).first());
  await heal(page, 'rfp2929 cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^RFP2929$/ }).first());

  await heal(page, 'rfp2929 span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2929$/ }).first());

  await heal(page, 'specifications tab', 'visible', null,
    () => page.locator('[data-cy="hub-tab-specifications"]'));
  await heal(page, 'specifications tab', 'click', null,
    () => page.locator('[data-cy="hub-tab-specifications"]'));

  await heal(page, 'edit button', 'visible', null,
    () => page.locator('[data-cy="edit-button"]'));
  await heal(page, 'edit button', 'click', null,
    () => page.locator('[data-cy="edit-button"]'));

  await heal(page, 'return to rfp link', 'visible', null,
    () => page.getByRole('link', { name: 'Return To Request For Proposal', exact: true }));
  await heal(page, 'return to rfp link', 'click', null,
    () => page.getByRole('link', { name: 'Return To Request For Proposal', exact: true }));

  await heal(page, 'request for proposal information heading', 'visible', null,
    () => page.locator('h2').filter({ hasText: /^Request for Proposal Information$/ }).first());

  await heal(page, 'expand all button', 'visible', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));
  await heal(page, 'expand all button', 'click', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));

  await heal(page, 'number of skus field', 'visible', null,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));
  await heal(page, 'number of skus field', 'fill', testData.numberOfSKUsProductItems,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));

  await heal(page, 'appearance color field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.substrateColor"][type="text"]'));
  await heal(page, 'appearance color field', 'fill', testData.appearanceColorRequired,
    () => page.locator('input[name="estimateSpecification.substrateColor"][type="text"]'));

  await heal(page, 'rfp list link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'rfp list link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'filters button', 'visible', null,
    () => page.getByRole('button', { name: 'Filters 0', exact: true }));
  await heal(page, 'filters button', 'click', null,
    () => page.getByRole('button', { name: 'Filters 0', exact: true }));

  await heal(page, 'status filter', 'visible', null,
    () => page.locator('li[data-label="Status"]'));
  await heal(page, 'status filter', 'click', null,
    () => page.locator('li[data-label="Status"]'));

  await heal(page, 'operator field', 'visible', null,
    () => page.locator('input[name="rows.0.operator"][type="text"]'));
  await heal(page, 'operator field', 'click', null,
    () => page.locator('input[name="rows.0.operator"][type="text"]'));

  await heal(page, 'is operator option', 'visible', null,
    () => page.locator('li[data-label="is"]'));
  await heal(page, 'is operator option', 'click', null,
    () => page.locator('li[data-label="is"]'));

  await heal(page, 'value field', 'visible', null,
    () => page.locator('[data-cy="filter-select-value"]'));
  await heal(page, 'value field', 'click', null,
    () => page.locator('[data-cy="filter-select-value"]'));

  await heal(page, 'requested option', 'visible', null,
    () => page.locator('li[data-label="Requested"]'));
  await heal(page, 'requested option', 'click', null,
    () => page.locator('li[data-label="Requested"]'));

  await heal(page, 'apply button', 'click', null,
    () => page.getByRole('button', { name: 'Apply', exact: true }));

  await heal(page, 'rfp2937 cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^RFP2937$/ }).first());
  await heal(page, 'rfp2937 cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^RFP2937$/ }).first());

  await heal(page, 'specifications tab', 'visible', null,
    () => page.locator('[data-cy="hub-tab-specifications"]'));
  await heal(page, 'specifications tab', 'click', null,
    () => page.locator('[data-cy="hub-tab-specifications"]'));

  await heal(page, 'expand all button', 'visible', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));
  await heal(page, 'expand all button', 'click', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));

  await heal(page, 'edit button', 'visible', null,
    () => page.locator('[data-cy="edit-button"]'));
  await heal(page, 'edit button', 'click', null,
    () => page.locator('[data-cy="edit-button"]'));

  await heal(page, 'expand all button', 'visible', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));
  await heal(page, 'expand all button', 'click', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));

  await heal(page, 'quantity break 1 field', 'visible', null,
    () => page.locator('input[name="estimate.quantity_break_1"][type="text"]'));
  await heal(page, 'quantity break 1 field', 'fill', testData.quantityBreak1,
    () => page.locator('input[name="estimate.quantity_break_1"][type="text"]'));

  await heal(page, 'number of skus field', 'visible', null,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));
  await heal(page, 'number of skus field', 'fill', testData.numberOfSKUsProductItems,
    () => page.locator('input[name="estimate.count_of_items"][type="text"]'));

  await heal(page, 'unit set type field', 'visible', null,
    () => page.locator('input[name="estimateSpecification.unitSetTypeId"][type="text"]'));
  await heal(page, 'unit set type field', 'click', null,
    () => page.locator('input[name="estimateSpecification.unitSetTypeId"][type="text"]'));

  await heal(page, 'sheeted/boxed option', 'visible', null,
    () => page.locator('li[data-label="Sheeted/Boxed"]'));
  await heal(page, 'sheeted/boxed option', 'click', null,
    () => page.locator('li[data-label="Sheeted/Boxed"]'));

  await heal(page, 'save rfp button', 'click', null,
    () => page.getByRole('button', { name: 'Save Request for Proposal', exact: true }));

  await heal(page, 'success message', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Request for Proposal updated successfully\. Close$/ }).first());

  await heal(page, 'specifications tab', 'visible', null,
    () => page.locator('[data-cy="hub-tab-specifications"]'));
  await heal(page, 'specifications tab', 'click', null,
    () => page.locator('[data-cy="hub-tab-specifications"]'));

  await heal(page, 'expand all button', 'visible', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));
  await heal(page, 'expand all button', 'click', null,
    () => page.getByRole('button', { name: 'Expand All', exact: true }));

  await heal(page, 'value 400 div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^400$/ }).first());

  await heal(page, 'value 12 div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^12$/ }).first());

  await heal(page, 'sheeted/boxed div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Sheeted\/Boxed$/ }).first());
});