/// <reference types="cypress" />

describe('Links', () => {

    it('Should_RedirectToSocial_When_ClickingOnIcons',() => {
// Go to the home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
// Check if all links are availible

    cy.get('a').each(page => {
        cy.request(page.prop('href'))
      })
})
})

