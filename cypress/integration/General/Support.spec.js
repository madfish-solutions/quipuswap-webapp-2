/// <reference types="cypress" />

describe('Support section', () => {
  it('Should_OpenPopup_When_ClickingOnSupport', () => {
    // Go to the home page
    cy.visit('/');
    // click on the Support
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="donationButton"]').click();
    // Support popup should opened
    cy.get('h5').should('contain', 'Donate');
    cy.get('[data-test-id="modalCard"] [data-test-id="connectButton"], [data-test-id="modalCard"] [data-test-id="donateButton"]')
      .should('exist');
    cy.get('[data-test-id="modalCard"] [data-test-id="closeButton"]').click();
  });
  it('Should_OpenPopup_When_ClickingOnConnectWallet', () => {
    cy.visit('/');
    //connect wallet popup should opened
    cy.get('[data-test-id="header"] [data-test-id="connectButton"]').click();
    cy.get('h5').should('contain', 'Connect wallet');
    cy.get('[data-test-id="modalCard"] [data-test-id="closeButton"]').click();
  });
});
