/// <reference types="cypress" />

describe('Send', () => {

    before(() => {
//before each 'it' go to send tab'
        cy.visit('/send/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0')
      
      })
    it('Should_BeElectedSendTab_When_ClickingOnSendTab',() => {
// check if Send tab is elected, not swap
      
        cy.get('[class="Tabs-module_item__2u87t Tabs-module_active__GDgMC"]').should('contain','Send')
    })
// Check if From/to tez/quipu, Send button is exists

    it('Should_DisplayTezInFromForm_When_PageIsLoaded', () => {
        cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain', 'TEZ')
    })
    it('Should_DisplayQuipuInToForm_When_PageIsLoaded', () => {
        cy.get(':nth-child(3) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain', 'QUIPU')
    })
//field recepient address exists
    it('Should_HaveFieldRecepientAddress_When_SendTabIsLoaded', () => {
        
        cy.get(':nth-child(4) > .ComplexInput_label__HWhH_').should('contain','Recipient address')
    })
})
