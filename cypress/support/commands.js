import '@percy/cypress';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
/**
 * Create percySnapshopElement
 * @see {@link https://github.com/percy/percy-cypress/issues/56#issuecomment-792860231}
 */

Cypress.Commands.add('percySnapshotElement', { prevSubject: true }, (subject, name, options) => {
    cy.percySnapshot(name, {
        domTransformation: (documentClone) => scope(documentClone, subject.selector),
        ...options
    })
})

function scope(documentClone, selector) {
    const element = documentClone.querySelector(selector)
    documentClone.querySelector('body').innerHTML = element.outerHTML

    return documentClone
}
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
