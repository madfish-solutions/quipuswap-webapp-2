/// <reference types="cypress" />

describe('Social media links', () => {

    it('Should_RedirectToCorrectLink_When_ClickingOnSocial',() => {
// Go to the home page
    cy.visit('/')
        
// Find social media links and clicking on it  
    cy.get('.Header_menuButton__1G_3l > .button_text__1Sa5- > svg')
        .click()
    cy.get(':nth-child(4) > .Socials_root__36fEs > [href="https://twitter.com/madfishofficial"]')
        .should('have.attr', 'href', 'https://twitter.com/madfishofficial');
    cy.get(':nth-child(4) > .Socials_root__36fEs > [href="https://t.me/MadFishCommunity"]')
        .should('have.attr','href','https://t.me/MadFishCommunity')
    cy.get(':nth-child(4) > .Socials_root__36fEs > [href="https://discord.com/invite/qFRZ8kVzkv"]')
        .should('have.attr','href','https://discord.com/invite/qFRZ8kVzkv')
    cy.get(':nth-child(4) > .Socials_root__36fEs > [href="https://github.com/madfish-solutions/"]')
        .should('have.attr','href','https://github.com/madfish-solutions/')
    cy.get(':nth-child(4) > .Socials_root__36fEs > [href="https://www.reddit.com/r/MadFishCommunity/"]')
        .should('have.attr','href','https://www.reddit.com/r/MadFishCommunity/')
    cy.get('[class="button_root__8MwxV button_dark__11Mod button_clean__36tRi"]')
        .should('have.attr','href','https://www.madfish.solutions/')
    })
})