/// <reference types="cypress" />

describe('Form exists', () => {
  it('Should_DisplayFarmingDetails_When_OpenFarming', () => {
    // Go to the Farming page
    cy.visit('/farming');
    // Find first farming and go in the farm form, check if title in the list contains tex/quipu
    cy.get('[href="/farming/0"]').click();
    //check the title
    cy.get('[data-test-id="farmingItemPageTitle"]').should('contain', 'TEZ / QUIPU');
    // check the title of the form
    cy.get('[data-test-id="tokenInputSelectButton"]').should('contain', 'TEZ / QUIPU');
  });
  // check if 'back to list' arrow works

  it('Should_DisplayFarmingList_When_ClickOnBackArrow', () => {
    cy.get('[data-test-id="farmingListPendingRewards"] [data-test-id="backTTListButton"]').click();
    cy.get('[data-test-id="farmingListPageTitle"]').should('contain', 'Farming');
  });
});
