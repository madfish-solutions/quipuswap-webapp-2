/// <reference types="cypress" />

describe('Form exists', () => {
  it('Should_DisplayVotingDetails_When_OpenedVotingPage', () => {
    // Go to the Voting page from home page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="secondaryNavigationButton-More"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="secondaryNavigationButton-More_Voting"]').click();
    // Check if Title 'Voting Details' ok
    cy.get('[data-test-id="votingDetails"] [data-test-id="headerContent"]').should('contain', 'Voting Details');
    cy.get('[data-test-id="votingDetails"] [data-test-id="delegatedTo"] [data-test-id="cellName"]').should(
      'contain',
      'Delegated To'
    );
  });

  it('Should_DisplayPageTitle_When_PageIsLoaded', () => {
    cy.get('[data-test-id="votingPageTitle"]').should('contain', 'Voting TEZ / QUIPU');
  });

  it('Should_DisplayRewardsSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="votingStats"] [data-test-id="description"]').should('contain', 'Your Claimable Rewards');
  });
});
