/// <reference types="cypress" />

describe('Form exists', () => {
  beforeEach(() => {
    cy.visit('/voting');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayVotingDetails_When_OpenedVotingPage', () => {
    cy.get('[data-test-id="votingDetails"] [data-test-id="headerContent"]')
      .should('contain', 'Voting Details');
    cy.get('[data-test-id="votingDetails"] [data-test-id="delegatedTo"] [data-test-id="cellName"]')
      .should('contain', 'Delegated To');
  });

  it('Should_DisplayPageTitle_When_PageIsLoaded', () => {
    cy.get('[data-test-id="votingPageTitle"]')
      .should('contain', 'Voting TEZ / QUIPU');
  });

  it('Should_DisplayRewardsSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="votingStats"] [data-test-id="description"]')
      .should('contain', 'Your Claimable Rewards');
  });
});
