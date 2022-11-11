describe('Visual test of the Home page', () => {

  it.skip('Should_CheckLayout_When_LoadingHomePage', () => {
    cy.visit('/');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.percySnapshot('HomePagelayout', {
      percyCSS: `
     [data-test-id='DEXDashboardDesktop'],
     [data-test-id='quipuTokenPrice'] { display: none; };
     `
    })
  })
})
