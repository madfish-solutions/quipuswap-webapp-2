/// <reference types="cypress" />

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Visual testing of the SSL form', () => {
  it('Should_DisplayCorrectSSLForm_When_OpenedSSLPage', () => {
    cy.visit('/stableswap/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.percySnapshot('SSLPagelayout', {
      percyCSS: `
     [data-test-id="SSLDashboardStatsInfo"], [data-test-id="stableliquidityList"] { display: none; };
     `
    })
  });
});
