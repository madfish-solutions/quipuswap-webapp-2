/// <reference types="cypress" />

describe('Support section', () => {

    it('Should_OpenPopup_When_ClickingOnSupport',() => {
// Go to the home page
    cy.visit('/')
// click on the Support

    cy.get('[data-test-id="header"] [data-test-id="menuButton"]')
        .click()
    cy.get('[data-test-id="menu"] [data-test-id="donationButton"]')
        .click()
// Support popup should opened
    cy.get('h5')
        .should('contain','Donate')
    cy.get('[data-test-id="modalCard"] [data-test-id="connectButton"], [data-test-id="modalCard"] [data-test-id="donateButton"]')
        .should('exist')
    cy.get('[data-test-id="modalCard"] [data-test-id="closeButton"]')
        .click()
})
    it('Should_OpenPopup_When_ClickingOnConnectWallet',() => {
//connect wallet popup should opened
    cy.get('[data-test-id="header"] [data-test-id="connectButton"]')
        .click()
    cy.get('h5')
        .should('contain','Connect wallet')
    cy.get('[data-test-id="modalCard"] [data-test-id="closeButton"]')
        .click()
    })

    //there is no selector for net swithcing. Add this section after
    
    // it('Should_HaveNetSwitcher_When_LoadingPage',() => {
    // cy.get(':nth-child(2) > .select-ui_root__2OTsf > .css-b62m3t-container > .customSelect__control > .customSelect__value-container > .customSelect__single-value')
    //     .click()
    // cy.get('#__next > div > div.Header_wrapper__3J4ym > div > footer > div:nth-child(2) > div > div > div.customSelect__control.customSelect__control--is-focused.customSelect__control--menu-is-open.css-1pahdxg-control')
    //     .should('exist')
    // })
})