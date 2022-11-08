/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Form exists', () => {
  beforeEach(() => {
    // Go to the remove page from home page
    cy.visit(`/liquidity/remove/tez-${MAINNET_QUIPU_TOKEN}`);
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayExchangeDetails_When_OpenedRLiquidityPage', () => {    
    cy.get('[data-test-id="poolDetails"] [data-test-id="headerContent"]').should('contain', 'Pool Details');
  });
  it('Should_DisplayPageTitle_When_OpenedRLiquidityPage', () => {
    cy.get('[data-test-id="liquidityPageTitle"]').should('contain', 'Liquidity');
  });
  it('Should_HaveTezQuipuPair_When_PageIsLoaded', () => {
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]'
    ).should('contain', 'TEZ / QUIPU');
  });
});
