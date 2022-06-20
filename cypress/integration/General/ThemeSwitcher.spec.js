/// <reference types="cypress" />

describe('Theme Switcher', () => {
  it('Should_ChangeBackgroundColour_When_ClickingOnSun', () => {
    // Go to home page
    cy.visit('/');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    // click on the theme swithcer sun, check if theme is white
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="lightButton"]').click();
    cy.get('[data-test-id="header"]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
  });
  it('Should_ChangeBackgroundColour_When_ClickingOnMoon', () => {
    // click on the theme swithcer moon, check if theme is black
    cy.get('[data-test-id="menu"] [data-test-id="darkButton"]').click();
    cy.get('[data-test-id="header"]').should('have.css', 'background-color', 'rgb(7, 12, 18)');
  });
});
