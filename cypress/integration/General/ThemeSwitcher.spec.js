/// <reference types="cypress" />

describe('Theme Switcher', () => {
  beforeEach(() => {
  cy.visit('/');
  cy.get('[data-test-id="acceptCookieButton"]').click();
  cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
});
  it('Should_ChangeBackgroundColour_When_ClickingOnSwitchThemeButton', () => {
    cy.get('[data-test-id="header"]').invoke('css', 'background-color').then((color) => {
      if ((color).includes('rgb(7, 12, 18)')) {
        cy.get('[data-test-id="menu"] [data-test-id="lightButton"]').click();
        cy.get('[data-test-id="header"]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
      } else {
        cy.get('[data-test-id="menu"] [data-test-id="darkButton"]').click();
        cy.get('[data-test-id="header"]').should('have.css', 'background-color', 'rgb(7, 12, 18)');
      }
    })
  })
});

