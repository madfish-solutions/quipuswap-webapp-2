/// <reference types="cypress" />

describe('Search section', () => {

    it.skip('Should_ChangeSwitcherStatus_When_ClickingOnSwitcher',() => {
// Go to the home page
        cy.visit('/farming')
// Check if swithcer is swithced

cy.get('.list-filter_switcherStakeOnly__1n0yF > .switcher_dark__3XZgQ').click()
cy.contains('[class="switcher_dark__3XZgQ switcher_switcher__lbRPM switcher_active__3eC7R switcher_disabled__tMh-i"]').click()

//
})
})
