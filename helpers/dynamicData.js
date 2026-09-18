const { faker } = require('@faker-js/faker');

/**
 * Generates unique business input values for one test session.
 * Keys match test-data.json fields used by recorded scripts.
 */
function generateDynamicFields() {
  return {
    firstNameRequired: faker.person.firstName(),
    lastNameRequired: faker.person.lastName(),
    nameRequired: faker.person.fullName(),
    opportunityName: faker.person.fullName(),
    projectDescription: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    descriptionRequired: faker.lorem.sentence(),
    appearanceColorRequired: faker.color.human(),
    substrateFaceOrFacestock: faker.commerce.productMaterial(),
    adhesiveRequired: faker.commerce.productAdjective(),
    linerRequired: faker.commerce.productMaterial(),
    editingAncillaryItemsQuantity: String(faker.number.int({ min: 1, max: 99 })),
    editingAncillaryItemsEstimate16Price: String(faker.number.int({ min: 1, max: 500 })),
    editFlatCost: String(faker.number.int({ min: 1, max: 99 })),
    costPerEach: String(faker.number.int({ min: 1, max: 500 })),
    costPerUnitSet: String(faker.number.int({ min: 1, max: 500 })),
    addressLine1: faker.location.streetAddress(),
    postalCode: faker.location.zipCode('######'),
    quantityBreak2: String(faker.number.int({ min: 10, max: 999 })),
    customerPartNumberRequired: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
    brandName: faker.company.name(),
    toothCount: String(faker.number.int({ min: 1, max: 99 })),
    numberOfSlits: String(faker.number.int({ min: 1, max: 9 })),
    numberAcrossStep: String(faker.number.int({ min: 1, max: 9 })),
    numberAroundRepeat: String(faker.number.int({ min: 1, max: 9 })),
    itemDefaultCost: String(faker.number.int({ min: 11, max: 99 })),
    itemDefaultPrice: String(faker.number.int({ min: 101, max: 999 })),
    notesRequired: faker.lorem.words(4),
    otherNotes: faker.lorem.sentence(),
  };
}

module.exports = {
  generateDynamicFields,
};
