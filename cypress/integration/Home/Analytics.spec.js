/// <reference types="cypress" />

describe('Analytics', () => {

    it('Should_RedirectToSwapPage_When_ClickingOnPairs',() => {
// Go to the home page
    cy.visit('/')
//Find 4th element in the table and click on 'Trade' button, it should lead to approptiate page
cy.get('[role="row"].Table-module_row__1zrIl').eq(3).then(tableRow =>{
    const pair = tableRow.find('[class="PoolTable_cardCellText__1RVsH"]').text()
    cy.wrap(tableRow).find('[class="PoolTable_button__1hVpB button_root__8MwxV button_dark__11Mod button_primary__6oU0X"]').click()
    cy.get('.page-title_pageTitle__2SlXy').then(title =>{
        expect(title.text()).to.contain(pair)
    })
})
})
})