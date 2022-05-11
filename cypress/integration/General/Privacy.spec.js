/// <reference types="cypress" />

describe('Privacy Police', () => {
  it('Should_RedirectToPrivacy_When_ClickingOnPrivacy', () => {
    // Go to the analytics page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="secondaryNavigationButton-More"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="secondaryNavigationButton-More_PrivacyPolicy"]').click();
    // Check if title ok, url is ok for privacy
    cy.get('[data-test-id="privacyPolicyTitle"]').should('contain', 'Privacy Policy');
    cy.url().should('contain', '/privacy-policy');
  });

  it('Should_RedirectToTherms_When_ClickingOnTherms', () => {
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="secondaryNavigationButton-More"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="secondaryNavigationButton-More_TermsOfService"]').click();
    //Check if titl is ok, url is ok for therms
    cy.get('[data-test-id="termsOfService"]').should('contain', 'Terms of Service');
    cy.url().should('contain', '/terms-of-service');
  });
});
