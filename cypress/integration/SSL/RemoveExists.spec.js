/// <reference types="cypress" />

import { FIELD_WAIT_TIMEOUT } from '../../const';

describe('Specific pool exist', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="farming-item-0"]').click();
    cy.get('[data-test-id="stableswapFromTabsCard"] [data-test-id="cardTab-1"]').click();
  });
  it('Should_DisplayLiquidityTitle_When_OpenSpecificPool', () => {
    cy.get('[data-test-id="SSLItemPageTitleRemove"]', { timeout: FIELD_WAIT_TIMEOUT })
      .should('contain', 'Liquidity KUSD / USDtz / uUSD');
  });
});
