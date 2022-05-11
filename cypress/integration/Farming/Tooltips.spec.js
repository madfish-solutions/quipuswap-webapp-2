/// <reference types="cypress" />

describe('Tooltips in the card', () => {
  it('Should_DisplayTooltips_When_HoweringMouseOverInTheCard', () => {
    // Go to the Farming number 5
    cy.visit('/farming/5');
    // check all tooltips
    cy.get('[data-test-id="farmingListPendingRewards"] [data-test-id="yourShare"] [data-test-id="tooltip"]').trigger(
      'focus'
    );
    cy.get('[aria-describedby="tippy-1"]').should('be.visible');

    cy.get('[data-test-id="farmingListPendingRewards"] [data-test-id="yourDelegate"] [data-test-id="tooltip"]').trigger(
      'focus'
    );
    cy.get('[aria-describedby="tippy-2"]').should('be.visible');

    cy.get(
      '[data-test-id="farmingListPendingRewards"] [data-test-id="lockPeriodEndsIn"] [data-test-id="tooltip"]'
    ).trigger('focus');
    cy.get('[aria-describedby="tippy-13"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="valueLocked"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-3"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="dailyDistribution"] [data-test-id="tooltip"]').trigger(
      'focus'
    );
    cy.get('[aria-describedby="tippy-4"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="APR"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-5"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="dailyApr"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-6"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="currentDelegate"] [data-test-id="tooltip"]').trigger(
      'focus'
    );
    cy.get('[aria-describedby="tippy-7"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="nextDelegate"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-8"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="farmingEndsIn"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-9"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="lockPeriod"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-10"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="withdrawalFee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-9"]').should('be.visible');

    cy.get('[data-test-id="farmingDetails"] [data-test-id="interfaceFee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-10"]').should('be.visible');
  });
});
