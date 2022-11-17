/// <reference types="cypress" />

describe.skip('Output field calculated', () => {
  beforeEach(() => {
    cy.visit('/coinflip');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayTitile_When_OpenedCoinflipPage', () => {
    cy.get('[id="coinflip-form-amount"]').click().type('1');
    cy.waitUntil(() => (cy.get('[id="coinflip-form-payout"]')
      .invoke('val').then(parseFloat).then((val) => !Number.isNaN(val))))
    cy.get('[id="coinflip-form-payout"]')
      .invoke('val').then(parseFloat).then((prevValue) => {
        cy.get('[data-test-id="coinflipPayoutCoefficient"] [data-test-id="amount"]')
          .invoke('text').then(parseFloat).should('eq', prevValue)
      })
  });
});
