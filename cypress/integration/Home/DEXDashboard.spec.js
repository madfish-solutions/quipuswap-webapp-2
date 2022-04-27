/// <reference types="cypress" />

describe('DEX Dashboard section', () => {

    it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons',() => {
    cy.visit('/')
// tooltip is ok

    cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="totalSupply"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-3"]')
        .should('be.visible')
    
    // cy.get('.Card-module_content__3gIG2 > :nth-child(1) > .DashboardCard_header__1QjFP > .tooltip_wrapper__2x_KN > .tooltip_info__3hAfB').trigger('focus')
    // cy.get('[aria-describedby="tippy-5"]')
    //     .should('be.visible')
          
    // cy.get('.Card-module_content__3gIG2 > :nth-child(2) > .DashboardCard_header__1QjFP > .tooltip_wrapper__2x_KN > .tooltip_info__3hAfB').trigger('focus')
    // cy.get('[aria-describedby="tippy-6"]')
    //     .should('be.visible')

    // cy.get('.Card-module_content__3gIG2 > :nth-child(3) > .DashboardCard_header__1QjFP > .tooltip_wrapper__2x_KN > .tooltip_info__3hAfB').trigger('focus')
    // cy.get('[aria-describedby="tippy-7"]')    
    // .should('be.visible')

    // cy.get('.Card-module_content__3gIG2 > :nth-child(4) > .DashboardCard_header__1QjFP > .tooltip_wrapper__2x_KN > .tooltip_info__3hAfB').trigger('focus')
    // cy.get('[aria-describedby="tippy-8"]')
    //     .should('be.visible')
})

    it('Should_DisplayStatisticInfo_When_PageIsLoaded',() => {
    // cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="TVL"] [data-test-id="amount"]')
    //     .should('exist')
        
    // cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="dailyVolume"] [data-test-id="amount"]')
    //     .should('exist')

    // cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="dailyTransaction"] [data-test-id="amount"]')
    //     .should('exist')
    
    cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="totalSupply"] [data-test-id="amount"]')
        .should('exist')
})
})