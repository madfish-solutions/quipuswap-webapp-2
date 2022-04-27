/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayFarmingDetails_When_OpenedSpecificFarming',() => {
// Go to the Farming page
    cy.visit('/farming')
// Find first farming and go in the farm form, check if title in the list is the same as title in the form
    cy.get('[href="/farming/0"]')
        .parents('[class="list-item_container__WfYXU"]')
        .then(titleL =>{
            const pair = titleL.find('[h4]').text()
            cy.wrap(titleL).find('[href="/farming/0"]')
                .click()
//check if the amount title is the same as in the list
            cy.get('[data-test-id="farmingItemPageTitle"]').then(title =>{
                expect(title.text()).to.contain(pair)
// check it the title of the form is the same as in the list
            cy.get('[class="page-title_pageTitle__2SlXy page-title_dark__2HY-h"]').then(title =>{
                expect(title.text()).to.contain(pair)
            })
        })
    })
})

})