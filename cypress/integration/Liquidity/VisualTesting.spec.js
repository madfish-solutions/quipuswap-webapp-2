describe('visual test', () => {

    it.skip('Should_TestLayout_When_LoadingLiqiudityPage', () => {
        cy.visit('/liquidity/add/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.wait(7000);
        cy.get('[data-test-id="liquidityPageTokenSelect"]')
            .toMatchImageSnapshot();
    })
})