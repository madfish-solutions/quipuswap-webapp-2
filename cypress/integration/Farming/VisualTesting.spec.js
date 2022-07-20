/// <reference types="cypress" />

//export PERCY_TOKEN=d6cef1e901a9a1eb8d6d32030f198e4e4ccc6de92544ce262d2dd5c39eba2aeb 

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Visual testing of the Farming page', () => {
    it('Should_DisplayCorrectlyFarmingPage_When_OpenedFarmingPage', () => {
        cy.visit('/farming');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.wait(DEFAULT_WAIT_TIMEOUT);
        cy.percySnapshot('FarmingPagelayout', {
            percyCSS: `
       [data-test-id='farmingListStats'],
       [data-test-id='farming-item-18'],
       [data-test-id='farming-item-17'],
       [data-test-id='farming-item-16'],
       [data-test-id='farming-item-15'],
       [data-test-id='farming-item-14'],
       [data-test-id='farming-item-13'],
       [data-test-id='farming-item-12'],
       [data-test-id='farming-item-11'],
       [data-test-id='farming-item-10'],
       [data-test-id='farming-item-9'],
       [data-test-id='farming-item-8'],
       [data-test-id='farming-item-7'],
       [data-test-id='farming-item-6'],
       [data-test-id='farming-item-5'],
       [data-test-id='farming-item-4'],
       [data-test-id='farming-item-3'],
       [data-test-id='farming-item-2'],
       [data-test-id='farming-item-1'],
       [data-test-id='farming-item-0'],
       [data-test-id='quipuTokenPrice'] { display: none; };
       `
        })
    });
});

