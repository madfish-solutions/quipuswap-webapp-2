/// <reference types="cypress" />

import { cssTransition } from "react-toastify";

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
  it('Should_Have_TotalWinsGteThan2900_When_PageIsLoaded', () =>{
    cy.waitUntil(() => (cy.get('[data-test-id="coinflipTotalWins"] [data-test-id="amount"]')
    .invoke('text').then(parseFloat).then((val) => !Number.isNaN(val))))
   cy.get('[data-test-id="coinflipTotalWins"] [data-test-id="amount"]')
   .invoke('text').then(parseInt).should('gte', 2)
  });
  it('Should_Have_GameCountGteThan473_When_PageIsLoaded', () =>{
    cy.get('[data-test-id="coinflipGamesCount"] [data-test-id="amount"]')
    .invoke('text').then(parseFloat).should('gte', 473)
  });
  it('Should_Have_MaxBetGteThan0_When_PageIsLoaded', () =>{
cy.get('[data-test-id="coinflipMaxAllowableBid"] [data-test-id="amount"]')
.invoke('text').then(parseFloat).should('gte', 0)
  });
});
