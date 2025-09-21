describe('Problem Creation Page', () => {
  beforeEach(() => {
    cy.visit('/problems');
  });

  it('toggle grid cell', () => {
    cy.get('#problem-board button').first().click();
    // verify cell is active
    cy.get('#problem-board button').first().should('have.class', 'bg-yellow-400');
  });

  it('reset', () => {
    cy.get('#problem-board button').first().click();

    cy.get('#reset-button').click();
    // verify all cells are off
    cy.get('#problem-board button').each(($cell) => {
      cy.wrap($cell).should('have.class', 'bg-gray-700');
    });
  });

  it('loading state during evaluation', () => {
    cy.get('#problem-board button').first().click();

    cy.intercept('POST', '/api/problems', {
      delay: 1000,
      statusCode: 200,
      body: {
        success: true,
        moves: 1,
        timeMs: 150,
      },
    }).as('createProblem');

    // perform action
    cy.get('#evaluate-button').click();

    // should show loading popup
    cy.get('#notification-popup').should('be.visible');
    cy.get('#notification-popup').should('contain', 'Processing...');

    cy.wait('@createProblem');

    // should show success message
    cy.get('#notification-popup').should('contain', 'Success!🎉');
  });

  it('success notification', () => {
    // successful API response
    cy.intercept('POST', '/api/problems', {
      statusCode: 200,
      body: {
        success: true,
        moves: 1,
        timeMs: 150,
      },
    }).as('createProblem');

    // perform action
    cy.get('#evaluate-button').click();

    cy.wait('@createProblem');

    // should show success popup
    cy.get('#notification-popup').should('be.visible');
    cy.get('#notification-popup').should('contain', 'Success!🎉');
    cy.get('#notification-popup').should('contain', 'There is a solution');
  });

  it('failure notification', () => {
    // unsuccessful API response
    cy.intercept('POST', '/api/problems', {
      statusCode: 200,
      body: {
        success: false,
        timeMs: 200,
      },
    }).as('createProblem');

    // perform action
    cy.get('#evaluate-button').click();

    cy.wait('@createProblem');

    // should show error popup
    cy.get('#notification-popup').should('be.visible');
    cy.get('#notification-popup').should('contain', 'Uh oh!');
    cy.get('#notification-popup').should('contain', 'There is no solution found');
  });

  it('grid resize', () => {
    // resize to 4x4
    cy.get('#size-selector').select('4');

    // should have 16 cells
    cy.get('#problem-board button').should('have.length', 16);
  });
});
