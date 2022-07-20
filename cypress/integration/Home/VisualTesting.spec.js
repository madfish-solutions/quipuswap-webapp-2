describe('visual test of the Home page', () => {

  it('Should_CheckLayout_When_LoadingHomePage', () => {
    cy.visit('/');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.percySnapshot('HomePagelayout', {
     percyCSS: `
     [data-test-id='DEXDashboardDesktop'],
     [data-test-id='quipuTokenPrice'] { display: none; };
     `
    })

    //only specific element  cy.get('[data-test-id="liquidityPageTokenSelect"]').percySnapshotElement('LiquidityInputFieldlayout')
  })
})