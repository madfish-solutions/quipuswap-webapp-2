/// <reference types="cypress" />

describe('Support section', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_OpenPopup_When_ClickingOnSupport', () => {
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="donationButton"]').click();
    // Support popup should opened
    cy.get('h5').should('contain', 'Donate');
    cy.get('[data-test-id="modalCard"] [data-test-id="connectButton"], [data-test-id="modalCard"] [data-test-id="donateButton"]')
      .should('exist');
  });
  it('Should_OpenPopup_When_ClickingOnConnectWallet', () => {
    cy.get('[data-test-id="header"] [data-test-id="connectButton"]').click();
    cy.get('h5').should('contain', 'Connect wallet');
    cy.get('[data-test-id="modalCard"] [data-test-id="closeButton"]').click();
  });
});
