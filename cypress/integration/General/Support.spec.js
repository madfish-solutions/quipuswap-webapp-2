/// <reference types="cypress" />

describe('Support section', () => {

    it('Should_OpenPopup_When_ClickingOnSupport',() => {
// Go to the home page
    cy.visit('/')
// click on the Support

    cy.get('.Header_menuButton__1G_3l > .button_text__1Sa5- > svg')
        .click()
    cy.get(':nth-child(3) > .donation-button_button__16jKq > .button_inner__244zH')
        .click()
// Support popup should opened
    cy.get('h5')
        .should('contain','Donate')
    cy.get('.donation-modal_button__1n8Qw')
        .should('exist')
    cy.get('.Modal_closeButton__36Gi3 > .button_text__1Sa5- > svg')
        .click()
})
    it('Should_OpenPopup_When_ClickingOnConnectWallet',() => {
//connect wallet popup should opened
    cy.get('.Header_connect__aX9Ew')
        .click()
    cy.get('h5')
        .should('contain','Connect wallet')
    cy.get('.Modal_closeButton__36Gi3')
        .click()
    })
    it('Should_HaveNetSwitcher_When_LoadingPage',() => {
    cy.get(':nth-child(2) > .select-ui_root__2OTsf > .css-b62m3t-container > .customSelect__control > .customSelect__value-container > .customSelect__single-value')
        .click()
    cy.get('#__next > div > div.Header_wrapper__3J4ym > div > footer > div:nth-child(2) > div > div > div.customSelect__control.customSelect__control--is-focused.customSelect__control--menu-is-open.css-1pahdxg-control')
        .should('exist')
    })
})