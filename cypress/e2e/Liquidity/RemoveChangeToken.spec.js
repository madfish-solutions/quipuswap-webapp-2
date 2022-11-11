/// <reference types="cypress" />

import { MICRO_WAIT_TIMEOUT } from '../../const';
import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Remove liquidity tab, calculating field', () => {
  beforeEach(() => {
    // Go to the remove page from home page
    cy.visit(`/liquidity/remove/tez-${MAINNET_QUIPU_TOKEN}`);
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayOutputFields_When_InputIs1', () => {
    cy.get('[data-test-id="positionSelectInput"]').click().type('1');
    cy.waitUntil(() => (cy.get('[data-test-id="outputA"] [data-test-id="outputA"]')
    .invoke('val').then(parseFloat).then((val) => !Number.isNaN(val))))
    cy.get('[data-test-id="outputA"] [data-test-id="outputA"]').invoke('val').then(parseFloat).should('be.gte', 0);
    cy.get('[data-test-id="outputB"] [data-test-id="outputB"]').invoke('val').then(parseFloat).should('be.gte', 0);
  });
  //change tez/quipu to kusd/quipu, check if output is kusd/quipu
  it('Should_HaveKusdQuipuPair_When_TokenIsChanged', () => {
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]')
      .click();
    cy.get('[data-test-id="TEZ"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="KUSD"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]')
      .invoke('text')
      .should('contain', 'QUIPU / KUSD');
  });
  it('Should_DisplayMaxInvested_When_InputIs1QuipuKusd', () => {
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]')
      .click();
    cy.get('[data-test-id="TEZ"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="KUSD"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get('[data-test-id="positionSelectInput"]').click().type('1');
    cy.waitUntil(() => (cy.get('[data-test-id="outputA"] [data-test-id="outputA"]')
    .invoke('val').then(parseFloat).then((val) => !Number.isNaN(val))))
    cy.get('[data-test-id="amount"]').invoke('text').then(parseFloat).should('be.gte', 0);
    cy.get('[data-test-id="amount"]').eq(1).invoke('text').then(parseFloat).should('be.gte', 0);
  });
  it('Should_DisplayQuipuKusdInDetailsSection_When_InputIs1', () => {
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]')
      .click();
    //Sell price in pool details section 1 quipu
    cy.wait(MICRO_WAIT_TIMEOUT);
    cy.get('[data-test-id="TEZ"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="KUSD"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get('[data-test-id="positionSelectInput"]').click().type('1');
    cy.waitUntil(() => (cy.get('[data-test-id="outputA"] [data-test-id="outputA"]')
    .invoke('val').then(parseFloat).then((val) => !Number.isNaN(val))))
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="amount"]')
      .eq(0).invoke('text').then(parseFloat).should('be.eq', 1);
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(0).invoke('text').should('contain', 'QUIPU');
    //sell price in pool details section =kusd
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(1).invoke('text').should('contain', 'KUSD');
    //Buy price in pool details section 1kusd = ...quipu
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="buyPrice"] [data-test-id="amount"]')
      .eq(0).invoke('text').then(parseFloat).should('be.eq', 1);
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(1).invoke('text').should('contain', 'KUSD');
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(3).invoke('text').should('contain', 'QUIPU');
  });
  it('Should_DisplayNotification_When_PoolDoesntExist', () => {
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]')
      .click();
      cy.wait(MICRO_WAIT_TIMEOUT);
    cy.get('[data-test-id="QUIPU"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="WRAP"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="TEZ"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="KUSD"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="connectButton"]')
      .prev().should('contain', 'Note! The pool does');
  });
});
