/// <reference types="cypress" />

describe('Privacy Police', () => {

    it('Should_RedirectToPrivacy_When_ClickingOnPrivacy',() => {
// Go to the analytics page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > :nth-child(6) > .Navigation_link__3RuTC').click()
        cy.get('.Navigation_menuOpened__2DZ5w > .Navigation_linksInner__1UOlU > [href="/privacy-policy"]').click()
// Check if title ok, url is ok for privacy
        cy.get('.PrivacyPolicy_mb24__3rYdw')
            .should('contain','Privacy Policy')
        cy.url()
            .should('contain','/privacy-policy')
})
    it('Should_RedirectToTherms_When_ClickingOnTherms',() => {
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > :nth-child(6) > .Navigation_link__3RuTC').click()
        cy.get('.Navigation_menuOpened__2DZ5w > .Navigation_linksInner__1UOlU > [href="/terms-of-service"]').click()
//Check if titl is ok, url is ok for therms
        cy.get('.Terms_mb24__jPuff')
            .should('contain','Terms of Service')
        cy.url()
            .should('contain','/terms-of-service')
    })

})
