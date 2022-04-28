/// <reference types="cypress" />

describe('Social media links', () => {
  it('Should_RedirectToCorrectLink_When_ClickingOnSocial', () => {
    // Go to the home page
    cy.visit('/');

    // Find social media links and clicking on it
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="socialButton-Twitter"]').should(
      'have.attr',
      'href',
      'https://twitter.com/madfishofficial'
    );
    cy.get('[data-test-id="menu"] [data-test-id="socialButton-Telegram"]').should(
      'have.attr',
      'href',
      'https://t.me/MadFishCommunity'
    );
    cy.get('[data-test-id="menu"] [data-test-id="socialButton-Discord"]').should(
      'have.attr',
      'href',
      'https://discord.com/invite/qFRZ8kVzkv'
    );
    cy.get('[data-test-id="menu"] [data-test-id="socialButton-Github"]').should(
      'have.attr',
      'href',
      'https://github.com/madfish-solutions/'
    );
    cy.get('[data-test-id="menu"] [data-test-id="socialButton-Reddit"]').should(
      'have.attr',
      'href',
      'https://www.reddit.com/r/MadFishCommunity/'
    );
    cy.get('[data-test-id="menu"] [data-test-id="madFishLogoButton"]').should(
      'have.attr',
      'href',
      'https://www.madfish.solutions/'
    );
  });
});
