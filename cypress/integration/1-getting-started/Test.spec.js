/// <reference types="cypress" />

describe('General', () => {

    it('Black/white theme',() => {
// Go to home page
        cy.visit('/')

// click on the theme swithcer sun, check if theme is white
    cy.get('.Header_menuButton__1G_3l').click()
    cy.get('.Menu_ml24__3Ez20 > .color-mode-switcher_root__2TSxp > .color-mode-switcher_light__yQtR6 > .color-mode-switcher_icon__21qzA').click()
    cy.get('[class="Header_root__2rRBu Header_light__1_5vD"]').should('have.css', 'background-color', 'rgb(250, 250, 252)')

// click on the theme swithcer moon, check if theme is black
    
    cy.get('.Menu_ml24__3Ez20 > .color-mode-switcher_root__2TSxp > .color-mode-switcher_dark__1xGvb > .color-mode-switcher_icon__21qzA').click()
    cy.get('[class="Header_root__2rRBu Header_dark__2gHr3"]').should('have.css', 'background-color', 'rgb(20, 23, 30)')
    })
})

describe('Home page Mainnet',() =>{

    it('Home page',() => {
//Go to the home page in package.json addres
        cy.visit('/')

//Find 'TEZ/KUSD' pair and click on the 'Trade' button, check if it leads to the 'Swap' page tez/kusd in the fields
        // cy.get('tbody').contains('tr', 'TEZ / KUSD').then(tableRow=>{
        //     cy.wrap(tableRow).find('[href="/swap/tez-KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV_0"]').click()
        // })
        // //check if the title of the page is tez/kusd, and the input fields are tez and kusd
        // cy.get('.page-title_pageTitle__2SlXy').should('contain', 'Swap TEZ / KUSD')
        // cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
        //     .should('contain', 'TEZ')
        // cy.get('.CommonContainer_mb24__2k7_w > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
        //     .should('contain', 'KUSD')


//Find 4th element in the table and click on 'Trade' button, it should lead to approptiate page
        cy.get('[role="row"].Table-module_row__1zrIl').eq(3).then(tableRow =>{
            const pair = tableRow.find('[class="PoolTable_cardCellText__1RVsH"]').text()
            cy.wrap(tableRow).find('[class="PoolTable_button__1hVpB button_root__8MwxV button_dark__11Mod button_primary__6oU0X"]').click()
            cy.get('.page-title_pageTitle__2SlXy').then(title =>{
                expect(title.text()).to.contain(pair)
            })
        })


// All 5 'Trade' buttons leads to an approriate pages in the first page

        // cy.get('[role="rowgroup"]').each((everyPair,index) => {
        //     cy.get('[role="row"].Table-module_row__1zrIl').index.then(tableRow =>{
        //         const pair = tableRow.find('[class="PoolTable_cardCellText__1RVsH"]').text()
        //         cy.wrap(tableRow).find('[class="PoolTable_button__1hVpB button_root__8MwxV button_dark__11Mod button_primary__6oU0X"]').click()
        //         cy.get('.page-title_pageTitle__2SlXy').then(title =>{
        //             expect(title.text()).to.contain(pair)
        //         })
        //     if (index<4){
        //         cy.visit('/')
        //     }
        //     })  
        // })


// // Go back to the home page
//         cy.visit('/')

// //click on the right arrow pagination, check if it is worked
//         cy.get(':nth-child(1) > .Table-module_footer__1HXhY > .Table-module_pagination__2zPD4 > .Table-module_arrowRight__3S-Pg > .Table-module_paginationArrow__RTc0-').click()
//         cy.get(':nth-child(1) > .Table-module_footer__1HXhY > .Table-module_pagination__2zPD4 > :nth-child(2)').should('contain','2')

// //click on the right arrow pagination, check if it is worked
//         cy.get(':nth-child(1) > .Table-module_footer__1HXhY > .Table-module_pagination__2zPD4 > .Table-module_arrowLeft__30hdA > .Table-module_paginationArrow__RTc0-').click()
//         cy.get(':nth-child(1) > .Table-module_footer__1HXhY > .Table-module_pagination__2zPD4 > :nth-child(2)').should('contain','1')
    })
})


describe('Home page Testnet',() => {

    it.only('first test for home page',() => {
// Go to the home page
        cy.visit('/')

// Notification about testnet is on
        cy.get('.testnet-alert_AlarmMessage__OqzrD').should('contain','You are on Testnet now!')

//'Start Trading' button should lead to the swap page, tez, quipu tokens are selected, comming back to the home page
        cy.get(':nth-child(1) > .Card-module_content__3gIG2 > .OpportunityCard_button__Ih7bg').click()
        cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain','TEZ')
        cy.get('.CommonContainer_mb24__2k7_w > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain', 'QUIPU')
        cy.visit('/')

//'Add Liquidity button on the home page leads to the Liquidity page, tez, quipu token are selected, comming back to the home page
        cy.get(':nth-child(3) > .Card-module_content__3gIG2 > .OpportunityCard_button__Ih7bg').click()
        cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain','TEZ')
        cy.get(':nth-child(3) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain', 'QUIPU')
        cy.visit('/')    

// Tooltip on home page 'Total supply' is visible
cy.get('.Card-module_content__3gIG2 > .DashboardCard_root__29IAS > .DashboardCard_header__1QjFP > .tooltip_wrapper__2x_KN > .tooltip_info__3hAfB > path')
            .should('be.visible')
    })
})


describe('Swap page',() => {

    it('Swap page test',() => {

// Go to the swap page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l > .button_text__1Sa5- > svg').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/swap"]').click()

   })
})