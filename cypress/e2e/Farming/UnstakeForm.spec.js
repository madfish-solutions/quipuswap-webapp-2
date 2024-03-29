/// <reference types="cypress" />

describe('Unstake form exists', () => {
  beforeEach(() => {
    cy.visit('/farming/v1/5');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_HiglightUnstakeForm_When_ClickOnUnstakeTab', () => {
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
