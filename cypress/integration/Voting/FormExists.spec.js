/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayVotingDetails_When_OpenedVotingPage',() => {
// Go to the Voting page from home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/voting/vote"]').click()
       
// Check if Title 'Voting Details' ok
        cy.get(':nth-child(2) > .Card-module_header__2yfdc')
            .should('contain', 'Voting Details')
        cy.get(':nth-child(1) > .CardCell-module_header__3h12j')
            .should('contain','Delegated To')
})
    it('Should_DisplayPageTitle_When_PageIsLoaded',() =>{
        cy.get('.page-title_pageTitle__2SlXy')
            .should('contain','Voting TEZ / QUIPU')
    })
    it('Should_DisplayRewardsSection_When_PageIsLoaded',() =>{
        cy.get('.voting-reward-item_rewardContent__EYIKW > :nth-child(1)')
            .should('contain','Your Claimable Rewards')
        cy.get(':nth-child(1) > .voting-stats-item_header__3YcOI')
            .should('contain','Your LP')
        cy.get(':nth-child(2) > .voting-stats-item_header__3YcOI')
            .should('contain','Your votes')
        cy.get(':nth-child(3) > .voting-stats-item_header__3YcOI')
            .should('contain','Your vetos')
    })
})