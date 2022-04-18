/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayFarmingDetails_When_OpenedSpecificFarming',() => {
// Go to the Farming page
    cy.visit('/farming')
// Find first farming and go in the farm form, check if title in the list is the same as title in the form
    cy.get('.button_root__8MwxV[href="farming/0"]')
        .parents('[class="list-item_container__1vDmh"]')
        .then(titleL =>{
            const pair = titleL.find('[class="tokens-logos-with-symbols_symbols__36p7B"]').text()
            cy.wrap(titleL).find('[class="list-item_button__2_6tc button_root__8MwxV button_dark__11Mod button_primary__6oU0X"]')
                .click()
//check if the amount title is the same as in the list
            cy.get('[class="ComplexInput_dangerContainer__143vX"]').then(title =>{
                expect(title.text()).to.contain(pair)
// check it the title of the form is the same as in the list
            cy.get('[class="page-title_pageTitle__2SlXy page-title_dark__2HY-h"]').then(title =>{
                expect(title.text()).to.contain(pair)
            })
        })
    })
})

})