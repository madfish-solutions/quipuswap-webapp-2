/// <reference types="cypress" />

describe('Form exists', () => {
  beforeEach(() => {
    cy.visit('/coinflip');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayTitile_When_OpenedCoinflipPage', () => {
    cy.get('[data-test-id="coinflipPageTitle"]').should('contain', 'Game');
  });
  it('Should_Have_WalletInfoSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="coinflipHereCanBeYourReward"]').should('contain', 'Here can be your reward');
  });
  it('Should_Have_TokenSelectSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="CoinflipTokenSelector"]').should('contain', 'Select Token to Play with');
  });
  it('Should_Have_SideSelectSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="coinflipDetails"]').should('contain', 'Select your side of coin');
  });
  it('Should_HaveGameInfoSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="coinflipRules"] [data-test-id="headerContent"]')
      .should('contain', 'Play Coinflip - get a chance to double your bid!')
  })

});
