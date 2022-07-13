/// <reference types="cypress" />

import { MICRO_WAIT_TIMEOUT } from '../../const';

describe('Select different slippage and check if max invested is ok', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
        cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]').click();
        cy.wait(MICRO_WAIT_TIMEOUT);
        cy.get('[data-test-id="KUSD"]').click();
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]').click();
        cy.wait(MICRO_WAIT_TIMEOUT);
        cy.get('[data-test-id="uUSD"]').click();
    });
    it('Should_DisplayCorrectMaxInvestedB_When_SecondFieldIs15Slippage5', () => {
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="settingsButton"]').click();
        cy.get('[data-test-id="modalCard"] [data-test-id="slippageLiquidity"] [data-test-id="presetButton-1"]').click()
        cy.get('[data-test-id="saveButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]').click().type('15');
        cy.contains('[title="15.075"]', '15.075')
            .invoke('text').then(parseFloat).should('be.gte', 15);
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
            .click().type('{backspace}').type('{backspace}');
    });
    it('Should_DisplayCorrectMaxInvestedA_When_FirstFieldIs50Slippage5', () => {
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="settingsButton"]').click();
        cy.get('[data-test-id="modalCard"] [data-test-id="slippageLiquidity"] [data-test-id="presetButton-1"]').click()
        cy.get('[data-test-id="saveButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('50');
        cy.contains('[title="50.25"]', '50.25')
            .invoke('text').then(parseFloat).should('be.gte', 50);
    });
    //choose 10% slippage, check if max invested is greater than input
    it('Should_DisplayCorrectMaxInvestedA_When_FirstFieldIs50Slippage10', () => {
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="settingsButton"]').click();
        cy.get('[data-test-id="modalCard"] [data-test-id="slippageLiquidity"] [data-test-id="presetButton-2"]')
            .next().click().type('10')
        cy.get('[data-test-id="saveButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('50');
        cy.contains('[title="55"]', '55')
            .invoke('text').then(parseFloat).should('be.gte', 50);
    });
    it('Should_DisplayCorrectMaxInvestedB_When_SecondFieldIs100Slippage10', () => {
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="settingsButton"]').click();
        cy.get('[data-test-id="modalCard"] [data-test-id="slippageLiquidity"] [data-test-id="presetButton-2"]')
            .next().click().type('10')
        cy.get('[data-test-id="saveButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
            .click().type('{backspace}').type('{backspace}');
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]').click().type('100');
        cy.contains('[title="110"]', '110')
            .invoke('text').then(parseFloat).should('be.gte', 100);
    });
    //choose 1% slippage, check if invested is ok
    it('Should_DisplayCorrectMaxInvestedA_When_FirstFieldIs1000Slippage1', () => {
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="settingsButton"]').click();
        cy.get('[data-test-id="modalCard"] [data-test-id="slippageLiquidity"] [data-test-id="presetButton-2"]')
            .click()
        cy.get('[data-test-id="saveButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]').click().type('100');
        cy.contains('[title="101"]', '101')
            .invoke('text').then(parseFloat).should('be.gte', 100);
    });
    it('Should_DisplayCorrectMaxInvestedA_When_FirstFieldIs22Slippage1', () => {
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="settingsButton"]').click();
        cy.get('[data-test-id="modalCard"] [data-test-id="slippageLiquidity"] [data-test-id="presetButton-2"]')
            .click()
        cy.get('[data-test-id="saveButton"]').click();
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
            .click().type('{backspace}').type('{backspace}').type('{backspace}');
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('22');
        cy.contains('[title="22.22"]', '22.22')
            .invoke('text').then(parseFloat).should('be.gte', 22);
    });
});
