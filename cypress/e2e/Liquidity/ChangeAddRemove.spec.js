/// <reference types="cypress" />

import { MICRO_WAIT_TIMEOUT } from '../../const';

describe.skip('When changing add tab to remove tab  and vice versa it should be the same selected tokens', () => {
  beforeEach(() => {
    cy.visit('/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_HaveSameTokenOnRemove_When_ClickingOnRemoveFromAdd', () => {
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]').click();
    cy.wait(MICRO_WAIT_TIMEOUT);
    cy.get('[data-test-id="wXTZ"]').click();
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]').click();
    cy.wait(MICRO_WAIT_TIMEOUT);
    cy.get('[data-test-id="USDS"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="cardTab-1"]').click();
    cy.get('[data-test-id="selectLPButton"]').should('contain', 'wXTZ / USDS');
  });
  it('Should_HaveSameTokenOnAdd_When_ClickingOnAddRemove', () => {
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="cardTab-1"]').click();
    cy.get('[data-test-id="selectLPButton"]').click();
    cy.get('[data-test-id="TEZ"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="QUIPU"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="tzBTC"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="STKR"] [data-test-id="checkbox"]').click();
    cy.get('[data-test-id="buttonSelect"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="cardTab-0"]').click();
    cy.get('[data-test-id="liquidityPageTitle"]').should('contain', 'tzBTC / STKR');
  });
});
