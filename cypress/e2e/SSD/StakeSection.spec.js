/// <reference types="cypress" />

describe('Stake section', () => {
  beforeEach(() => {
    cy.visit('/stableswap/dividends/stake/0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayDataInTheInputFIeld_When_Typing1InIt', () => {
    cy.get('[id="stake-form"]').click().type(1);
    cy.get('[id="stake-form"]').should('have.value', '1')
  });
  it('Should_HaveTagWhitelisted_When_PageIsLoaded', () => {
    cy.get('[data-test-id="timeLockLabel"]').should('contain', 'Whitelisted')
  });
  it('Should_DisplayQUIPULocked_When_PageIsLoaded', () => {
    cy.get('[data-test-id="tokenLocked"] [data-test-id="cellName"]').should('contain', 'Token QUIPU locked')
  });
  it('Should_OpenSettingsPopup_When_ClickingOnSettingButton', () => {
    cy.get('[data-test-id="stableswapFromTabsCard"] [data-test-id="settingsButton"]').click()
    cy.get('[data-test-id="modalCard"] [data-test-id="headerContent"] [data-test-id="cardTitle"]').should('contain', 'Settings')
  });
  it.only('Should_RedirectToList_When_ClickingOnBackButton', () => {
    cy.get('[data-test-id="backTTListButton"]').click();
    cy.get('[data-test-id="stableDividendsPageTitle"]').should('contain', 'Stableswap Dividends')
  });
});
