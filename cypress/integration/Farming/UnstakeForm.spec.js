/// <reference types="cypress" />

describe('Unstake form exists', () => {
  it('Should_HiglightUnstakeForm_When_ClickOnUnstakeTab', () => {
    // Go to the 5 Farming, unstake form
    cy.visit('/farming/5');
    cy.get('[title="Unstake"]').click().should('have.css', 'color', 'rgb(139, 144, 160)');
  });

  it('Should_HaveConnectWalletButton_When_ClickOnUnstakeTab', () => {
    cy.get('[data-test-id="farmingFromTabsCard"] [data-test-id="connectButton"]').should('exist');
  });

  it('Should_HaveFarmingDetailsHeader_When_ClickOnUnstakeTab', () => {
    cy.get('[data-test-id="farmingDetails"] [data-test-id="headerContent"]').should('exist');
  });

  it('Should_HaveTagsInFarmingDetailsSection_When_ClickOnUnstakeTab', () => {
    cy.get('[data-test-id="tags"]').should('exist');
  });

  it('Should_HavePendingRewardsSection_When_ClickOnUnstakeTab', () => {
    cy.get('[data-test-id="farmingListPendingRewards"]').should('exist');
  });
});
