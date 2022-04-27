/// <reference types="cypress" />

describe('News', () => {

    it('Should_RedirectToNews_When_ClickingOnNews',() => {
// Go to the home page
    cy.visit('/')
// check all news links

    cy.get('[data-test-id="newsSection"]').find('a').each(page => {
        cy.request(page.prop('href'))
      })
})
})