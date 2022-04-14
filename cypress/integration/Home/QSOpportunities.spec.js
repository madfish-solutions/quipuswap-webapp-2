/// <reference types="cypress" />

describe('QuipuSwap Opportunities section', () => {

it('Should_RedirectToSwapPage_When_ClickingOnStartTradingButton',() => {
cy.visit('/')

//'Start Trading' button should lead to the swap page, tez, quipu tokens are selected
cy.get(':nth-child(1) > .Card-module_content__3gIG2 > .OpportunityCard_button__Ih7bg').click()
cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
    .should('contain','TEZ')
cy.get('.CommonContainer_mb24__2k7_w > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
    .should('contain', 'QUIPU')
})

it('Should_RedirectToLiquidityPage_When_ClickingOnAddLiquidityButton',() => {
cy.visit('/')
   
//'Add Liquidity button on the home page leads to the Liquidity page, tez, quipu token are selected
cy.get(':nth-child(3) > .Card-module_content__3gIG2 > .OpportunityCard_button__Ih7bg').click()
cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
    .should('contain','TEZ')
cy.get(':nth-child(3) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
    .should('contain', 'QUIPU') 
})
})