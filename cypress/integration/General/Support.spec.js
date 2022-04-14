/// <reference types="cypress" />

describe('Support section', () => {

    it('Should_OpenPopup_When_ClickingOnSupport',() => {
// Go to the home page
    cy.visit('/')
// click on the Support

cy.get('.Header_menuButton__1G_3l > .button_text__1Sa5- > svg')
    .click()
      })
})