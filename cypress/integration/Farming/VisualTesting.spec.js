/// <reference types="cypress" /> 

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Visual testing of the Farming page', () => {
	beforeEach(() => {
		cy.visit('farming');
		cy.get('[data-test-id="acceptCookieButton"]').click();
		cy.wait(DEFAULT_WAIT_TIMEOUT);
	});
	it('Should_DisplayCorrectlyFarmingPage_When_OpenedFarmingPage', () => {
		cy.percySnapshot('FarmingPagelayout', {
			percyCSS: `
       [data-test-id='farmingListStats'],
       [data-test-id='farmingList'],
       [data-test-id='quipuTokenPrice'] { display: none; };
       `
		});
	});
	it.skip('Should_DisplayCorrectTezMchPool_When_OpenedFarmingPage', () => {
		cy.get('[data-test-id="farming-item-15"]').percySnapshotElement('TezMchPoolInList', {
			percyCSS: `
            [data-test-id="amount"] { display: none; };
            `
		})
	})
	it.skip('Should_DisplayCorrectSStzBtcUBtcPool_When_OpenedFarmingPage', () => {
		cy.get('[data-test-id="farming-item-17"]').percySnapshotElement('SSLPoolInList', {
			percyCSS: `
            [data-test-id="amount"] { display: none; };
            `
		})
	})

});

