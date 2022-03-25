/// <reference types="cypress" />

describe('Should_RedirectToSocial_When_ClickingOnIcons', () => {

    it('Should_RedirectToSocial_When_ClickingOnIcons',() => {
// Go to the home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
// Check if all links are availible and response is 200  

    cy.get('a').each(page => {
        cy.request(page.prop('href'))
      })
})
})

