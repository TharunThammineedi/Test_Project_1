import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Assign User in RFP @regression', async ({ page }) => {
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

  await heal(page, 'assigned by me tab', 'click', null,
    () => page.locator('[data-cy="hub-tab-assigned-by-me"]'));

  await heal(page, 'request for proposals link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'request for proposals link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'mine filter', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Mine$/ }).first());
  await heal(page, 'mine filter', 'click', null,
    () => page.locator('div').filter({ hasText: /^Mine$/ }).first());

  await heal(page, 'rfp2959 cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^RFP2959$/ }).first());
  await heal(page, 'rfp2959 cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^RFP2959$/ }).first());

  await heal(page, 'rfp2959 span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2959$/ }).first());

  await heal(page, 'rfp2959 heading', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2959 - Request for Proposal$/ }).first());

  await heal(page, 'estimate edit button', 'click', null,
    () => page.locator('[data-cy="estimateEditButton"]'));

  await heal(page, 'estimate description field', 'fill', testData.estimate,
    () => page.locator('#estimate.description'));

  await heal(page, 'estimate save button', 'click', null,
    () => page.locator(`[id="estimate::edit-save-${testData.otp}"]`));

  await heal(page, 'description div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Description Testing123$/ }).first());

  await heal(page, 'status div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Status Requested$/ }).first());

  await heal(page, 'estimate edit button', 'click', null,
    () => page.locator('[data-cy="estimateEditButton"]'));

  await heal(page, 'status field', 'visible', null,
    () => page.locator('input[name="status"][type="text"]'));
  await heal(page, 'status field', 'click', null,
    () => page.locator('input[name="status"][type="text"]'));

  await heal(page, 'estimate cancel button', 'click', null,
    () => page.locator(`[id="estimate::edit-close-${testData.otp}"]`));

  await heal(page, 'select user button', 'visible', null,
    () => page.getByRole('button', { name: 'Select User', exact: true }));
  await heal(page, 'select user button', 'click', null,
    () => page.getByRole('button', { name: 'Select User', exact: true }));

  await heal(page, 'rohith ranga cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^Rohith Ranga$/ }).first());
  await heal(page, 'rohith ranga cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^Rohith Ranga$/ }).first());

  await heal(page, 'rohith ranga div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Rohith Ranga$/ }).first());

  await heal(page, 'unlink button', 'visible', null,
    () => page.getByRole('button', { name: 'Unlink', exact: true }));

  await heal(page, 'continue button', 'click', null,
    () => page.getByRole('button', { name: 'Continue', exact: true }));

  await heal(page, 'rohith ranga button', 'visible', null,
    () => page.getByRole('button', { name: 'Rohith Ranga', exact: true }));
});