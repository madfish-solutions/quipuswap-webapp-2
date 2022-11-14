/// <reference types="cypress" />

describe('User can choose token and side', () => {
  beforeEach(() => {
    cy.visit('/coinflip');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_SelectTezToken_When_ClickingOnIt', () => {
    cy.get('[data-test-id="XTZ"]').click();
    cy.get('[data-test-id="tokensSymbols"]').should('contain', 'TEZ')
    cy.get('[data-test-id="rightVisibleCurrency"]').should('contain', 'XTZ')
  });
  it('Should_SelectQuipuToken_When_ClickingOnIt', () => {
    cy.get('[data-test-id="QUIPU"]').click();
    cy.get('[data-test-id="tokensSymbols"]').should('contain', 'QUIPU')
    cy.get('[data-test-id="rightVisibleCurrency"]').should('contain', 'QUIPU')
  });
  it('Should_SelectHead_When_ClickingOnIt', () => {
    cy.get('[data-test-id="coinflipHeadButton"]').click();
    cy.get('[data-test-id="coinflipHeadButton"]').should('contain', 'Head')
  });
  it('Should_UnselectHead_When_UnselectingIt', () =>{
    cy.get('[data-test-id="coinflipHeadButton"]').click();
    cy.get('[data-test-id="coinflipHeadButton"]').click();
    cy.get('[data-test-id="coinflipHeadButton"]').should('contain', '')
  });
  it('Should_SelectTail_When_ClickingOnIt', () => {
    cy.get('[data-test-id="coinflipTailButton"]').click();
    cy.get('[data-test-id="coinflipTailButton"]').should('contain', 'Tail')
  });
  it('Should_UnselectTail_When_UnselectingIt', () =>{
    cy.get('[data-test-id="coinflipTailButton"]').click();
    cy.get('[data-test-id="coinflipTailButton"]').click();
    cy.get('[data-test-id="coinflipTailButton"]').should('contain', '')
  })
});
