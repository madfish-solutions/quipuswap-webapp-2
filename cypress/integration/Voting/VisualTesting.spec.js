/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Visual testing of the Voting page', () => {
    it('Should_DisplayCorrectSwapInputForm_When_OpenedVotingPage', () => {
        cy.visit('/voting/vote/tez-' + MAINNET_QUIPU_TOKEN);
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.percySnapshot('VotingPagelayout', {
            percyCSS: `
        [data-test-id='votingDetails'],
       [data-test-id='quipuTokenPrice'] { display: none; };
       `
        })
    });
});
