describe('visual test', () => {

  it('Should_TestInputFieldLayout_When_LoadingLiqiudityPage', () => {
    cy.visit('/liquidity/add/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.percySnapshot('LiquidityPagelayout', {
      percyCSS: `[data-test-id='quipuTokenPrice'] { display: none; }`
    })
    //this one is good!!! only specific element  cy.get('[data-test-id="liquidityPageTokenSelect"]').percySnapshotElement('LiquidityInputFieldlayout')
  })
})