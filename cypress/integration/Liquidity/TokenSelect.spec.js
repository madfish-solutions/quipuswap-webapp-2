/// <reference types="cypress" />

import { DEFAULT_WAIT_TIMEOUT, REPEAT_WAIT_TIMEOUT } from '../../const';

describe('Select new tokens in the fields', () => {
  it('Should_DisplayNewTokens_When_SelectIt', () => {
    // Go to the liquidity page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
    cy.get('[data-test-id="acceptCookieButton"]').click();
    // Choose new tokens and check if new token are selected in the field
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]').click();
    cy.get('[data-test-id="KUSD"]').click();
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]').should('contain', 'KUSD');
  });
  it('Should_RecalculateSecondInput_When_1InTheFirstInput', () => {
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
    cy.reload();
  });
  it('Should_DisplayDataInFirstInput_When_SecondInputIs1', () => {
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]', { timeout: REPEAT_WAIT_TIMEOUT })
      .click()
      .type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
  });
  it('Should_DisplayNewTokenInSecondInput_When_SecondInputIsChanged', () => {
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]').click();
    cy.get('[data-test-id="hDAO"]').click();
  });
  it('Should_DisplayNewTitle_When_NewTokenAreSelected', () => {
    // Check if title of the page is ok
    cy.get('[data-test-id="liquidityPageTitle"]').should('contain', 'KUSD / hDAO');
  });
  it('Should_DisplayNewInfoInPoolDetailsSection_When_NewTokenAreSelected', () => {
    // Check if title of the page is ok
    cy.get('[data-test-id="sellPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'KUSD');
    cy.get('[data-test-id="sellPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'hDAO');
    cy.get('[data-test-id="buyPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'KUSD');
    cy.get('[data-test-id="buyPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'hDAO');
  });
  it('Should_BeEmptyFieldInFirstInput_When_NewTokenAreSelected', () => {
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.NaN');
  });
  it('Should_HaveAllertMessage_When_PoolDoesntExist', () => {
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"]').contains('Note! The pool does');
  });
  it('Should_HaveEmtyDataInDetailsSecction_When_PoolDoesntExist', () => {
    cy.get('[data-test-id="sellPrice"]').invoke('val').then(parseFloat).should('be.NaN');
  });
  it('Should_CalculateFirstToken_When_TokenToTokenInExistingPool', () => {
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]').click();
    cy.get('[data-test-id="uUSD"]').click();
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
  });
  it('Should_CalculateSecondInput_When_FirstInputIsChangedInExistingPool', () => {
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('{backspace}');
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
    cy.reload();
  });
  it('Should_DisplayCorrectMaxInvestedA_When_FirstFieldIs1', () => {
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('11');
    cy.contains('[title="11"]', '11').should('contain', 11);
  });
  it('Should_DisplayCorrectMaxInvestedB_When_SecondFieldIs15', () => {
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]').click();
    cy.get('[data-test-id="KUSD"]').click();
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]').click();
    cy.get('[data-test-id="uUSD"]').click();
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]').click().type('15');
    cy.contains('[title="15"]', '15').should('contain', 15);
  });
});
