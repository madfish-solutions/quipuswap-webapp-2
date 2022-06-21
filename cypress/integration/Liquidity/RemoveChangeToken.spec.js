/// <reference types="cypress" />

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Remove liquidity tab, calculating field', () => {
  before(() => {
    // Go to the remove page from home page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="cardTab-1"]').click();
  });
  it('Should_DisplayOutputFields_When_InputIs1', () => {
    cy.get('[data-test-id="positionSelectInput"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="outputA"] [data-test-id="outputA"]').invoke('val').then(parseFloat).should('be.gte', 0);
    cy.get('[data-test-id="outputB"] [data-test-id="outputB"]').invoke('val').then(parseFloat).should('be.gte', 0);
  });
  //change tez/quipu to kusd/quipu, check if output is kusd/quipu
  it('Should_HaveKusdQuipuPair_When_TokenIsChanged', () => {
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]'
    ).click();
    cy.get('[data-test-id="TEZ"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="KUSD"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]'
    )
      .invoke('text')
      .should('contain', 'QUIPU / KUSD');
  });
  it('Should_DisplayMaxInvested_When_InputIs1QuipuKusd', () => {
    cy.reload();
    cy.get('[data-test-id="positionSelectInput"]').click().type('1');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="amount"]').invoke('text').then(parseFloat).should('be.gte', 0);
    cy.get('[data-test-id="amount"]').eq(1).invoke('text').then(parseFloat).should('be.gte', 0);
  });
  it('Should_DisplayQuipuKusdInDetailsSection_When_InputIs1', () => {
    //Sell price in pool details section 1 quipu
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="amount"]')
      .eq(0)
      .invoke('text')
      .then(parseFloat)
      .should('be.eq', 1);
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(0)
      .invoke('text')
      .should('contain', 'QUIPU');
    //sell price in pool details section =kusd
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(1)
      .invoke('text')
      .should('contain', 'KUSD');
    //Buy price in pool details section 1kusd = ...quipu
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="amount"]')
      .eq(2)
      .invoke('text')
      .then(parseFloat)
      .should('be.eq', 1);
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(2)
      .invoke('text')
      .should('contain', 'KUSD');
    cy.get('[data-test-id="detailsCardCells"] [data-test-id="rightVisibleCurrency"]')
      .eq(3)
      .invoke('text')
      .should('contain', 'QUIPU');
  });
  it('Should_DisplayNotification_When_PoolDoesntExist', () => {
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]'
    ).click();
    cy.get('[data-test-id="QUIPU"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="WRAP"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="connectButton"]')
      .prev()
      .should('contain', 'Note! The pool does');
  });
});
