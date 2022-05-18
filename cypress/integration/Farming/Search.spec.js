/// <reference types="cypress" />

describe('Search section', () => {
  it('Should_SwitchActiveOnly_When_ClickingOnIt', () => {
    // Go to the farming page
    cy.visit('/farming');
    // Click on 'Active only' swithcer, check if the colour of the swithcer is gray
    cy.get('[data-test-id="activeOnlySwitcher"]').click().should('have.css', 'background-color', 'rgb(161, 164, 177)');
  });

  it('Should_NotSwitchStakedOnly_When_ClickingOnIt', () => {
    // Click on 'Staked only' swithcer, chek if it is gray(not clicked)
    cy.get('[data-test-id="stakedOnlySwitcher"]').click().should('have.css', 'background-color', 'rgb(211, 212, 216)');
  });
});
