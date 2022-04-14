/// <reference types="cypress" />

describe('News', () => {

    it('Should_RedirectToNews_When_ClickingOnNews',() => {
// Go to the home page
    cy.visit('/')
// check all news links

    cy.get('[class="Slider-module_root__2fOJq News_uncenter__w8Kef Slider-module_dark__1axr0"]').find('a').each(page => {
        cy.request(page.prop('href'))
      })
})
})