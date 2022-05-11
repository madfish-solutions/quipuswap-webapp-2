/// <reference types="cypress" />

describe('Form exists', () => {
  it('Should_DisplayFarmingDetails_When_OpenedFarmingPage', () => {
    // Go to the Farming page from home page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-4"]').click();

    // Check if Title 'Farming' ok
    cy.get('[data-test-id="farmingListPageTitle"]').should('contain', 'Farming');
    // check if 'Total value' text is ok
    cy.get('[data-test-id="Total Value Locked"]').should('contain', 'Total Value Locked');
    // Check if 'Earn extra income' text is ok
    cy.get('[data-test-id="farmingListPendingRewards"]').should('contain', 'Earn extra income with QuipuSwap');
    //Check if one of the farmings is availible
    cy.get('[data-test-id="farming-item-6"]').should('exist');
  });
});
