/// <reference types="cypress" />

describe('Should_ChangeBackgroundColour_When_ClickingOnSunOrMoon', () => {

    it('Should_ChangeBackgroundColour_When_ClickingOnSunOrMoon',() => {
// Go to home page
        cy.visit('/')

// click on the theme swithcer sun, check if theme is white
    cy.get('.Header_menuButton__1G_3l').click()
    cy.get('.Menu_ml24__3Ez20 > .color-mode-switcher_root__2TSxp > .color-mode-switcher_light__yQtR6 > .color-mode-switcher_icon__21qzA').click()
    cy.get('[class="Header_root__2rRBu Header_light__1_5vD"]').should('have.css', 'background-color', 'rgb(250, 250, 252)')

// click on the theme swithcer moon, check if theme is black
    
    cy.get('.Menu_ml24__3Ez20 > .color-mode-switcher_root__2TSxp > .color-mode-switcher_dark__1xGvb > .color-mode-switcher_icon__21qzA').click()
    cy.get('[class="Header_root__2rRBu Header_dark__2gHr3"]').should('have.css', 'background-color', 'rgb(20, 23, 30)')
    })
})