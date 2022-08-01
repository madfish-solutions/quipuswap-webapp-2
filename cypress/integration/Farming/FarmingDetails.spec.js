/// <reference types="cypress" />

describe('Form exists', () => {
  beforeEach(() => {
    cy.visit('/farming');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="farming-item-17"]').click();
  });
  it('Should_DisplayFarmingDetails_When_OpenFarming', () => {
    //check the title
    cy.get('[data-test-id="farmingItemPageTitle"]').should('contain', 'Farming tzBTC/uBTC');
    // check the title of the form
    cy.get('[data-test-id="tokenInputSelectButton"]').should('contain', 'tzBTC / uBTC');
  });
  // check if 'back to list' arrow works
  it('Should_DisplayFarmingList_When_ClickOnBackArrow', () => {
    cy.get('[data-test-id="farmingListPendingRewards"] [data-test-id="backTTListButton"]').click();
    cy.get('[data-test-id="farmingListPageTitle"]').should('contain', 'Farming');
  });
});
