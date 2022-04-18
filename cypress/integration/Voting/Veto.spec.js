/// <reference types="cypress" />

describe('Veto', () => {

    before(() => {
//before each 'it' go to veto tab'
        cy.visit('/voting/vote/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0')
        cy.get('[title="Veto"]')
            .click()
      
      })
    it('Should_BeElectedVetoTab_When_ClickingOnVetoTab',() => {
// check if Veto tab is elected
      
        cy.get('[class="Tabs-module_item__2u87t Tabs-module_active__GDgMC"]').should('contain','Veto')
    })
    it('Should_BeTezQuipuInTheField_When_PageIsLoaded', () => {
        cy.get('.ComplexInput_token__ZYlsp')
            .should('contain','TEZ / QUIPU')
    })
    it('Should_HaveTitleVeto_When_PageIsLoaded', () => {
        cy.get('.ComplexInput_label__HWhH_')
            .should('contain','Veto')
    })
})