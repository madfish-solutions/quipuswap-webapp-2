/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayFarmingDetails_When_OpenedFarmingPage',() => {
// Go to the Farming page from home page
        cy.visit('/')
        cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click()
        cy.get('[data-test-id="menu"] [data-test-id="navigationButton-4"]').click()
       
// Check if Title 'Farming' ok
        cy.get('[data-test-id="farmingListPageTitle"]')
            .should('contain', 'Farming')
// check if 'Total value' text is ok
        cy.get('.slick-current > :nth-child(1) > .top-stats_container__31ipz > .top-stats_title__38Gvl')
            .should('contain','Total Value  Locked')
// Check if 'Earn extra income' text is ok
        cy.get('.pending-rewards_amount__3jDO2')
            .should('contain', 'Earn extra income with QuipuSwap')
        cy.get('data-test-id="networkSelectButton"').click()
})

})