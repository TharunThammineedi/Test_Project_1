const path = require('path');

const ROOT = path.join(__dirname, '..');

module.exports = {
  ROOT,
  TEST_DATA: path.join(ROOT, 'test-data.json'),
  // Outside test-results/ so Playwright does not wipe it between runs
  SESSION_DATA: path.join(ROOT, 'data', 'session-data.json'),
  DYNAMIC_KEYS: [
    'firstNameRequired',
    'lastNameRequired',
    'nameRequired',
    'opportunityName',
    'projectDescription',
    'description',
    'descriptionRequired',
    'appearanceColorRequired',
    'substrateFaceOrFacestock',
    'adhesiveRequired',
    'linerRequired',
    'editingAncillaryItemsQuantity',
    'editingAncillaryItemsEstimate16Price',
    'editFlatCost',
    'costPerEach',
    'costPerUnitSet',
    'addressLine1',
    'postalCode',
    'quantityBreak2',
    'customerPartNumberRequired',
    'brandName',
    'toothCount',
    'numberOfSlits',
    'numberAcrossStep',
    'numberAroundRepeat',
    'itemDefaultCost',
    'itemDefaultPrice',
    'notesRequired',
    'otherNotes',
  ],
};
