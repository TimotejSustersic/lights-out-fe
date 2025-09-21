describe('Solutions Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/problems', {
      statusCode: 200,
      body: [
        {
          id: 1,
          size: 3,
          difficulty: 0.2,
          grid: [1, 0, 1, 0, 1, 0, 1, 0, 1],
          timestamp: '2024-01-01T10:00:00Z',
        },
        {
          id: 2,
          size: 4,
          difficulty: 0.4,
          grid: [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
          timestamp: '2024-01-01T11:00:00Z',
        },
      ],
    }).as('getProblems');
    cy.visit('/solutions');
    cy.wait('@getProblems');
  });

  it('display problems list', () => {
    cy.get('#problems-table-container').should('be.visible');
    cy.get('#problems-table-container thead').should('contain', 'Size');
    cy.get('#problems-table-container thead').should('contain', 'Difficulty');
    cy.get('#problems-table-container thead').should('contain', 'Created');
  });

  it('select a problem', () => {
    // select the first problem
    cy.get('#problems-table-container tbody tr').first().click();
    // verify game board is visible
    cy.get('#game-area app-board').should('be.visible');
    // verify timer and moves
    cy.get('#countdown').should('contain', '5:00');
    cy.get('#movescounter').should('contain', '0');
    // verify action buttons
    cy.get('#game-area').contains('button', 'Reset').should('be.visible');
    cy.get('#game-area').contains('button', 'Get solution').should('be.visible');
  });

  it('reset', () => {
    // select a problem
    cy.get('#problems-table-container tbody tr').first().click();
    // change a cell state
    cy.get('#game-area app-board button').first().click();
    
    cy.get('#game-area').contains('button', 'Reset').click();

    // verify timer and moves reset
    cy.get('#countdown').should('contain', '5:00');
    cy.get('#movescounter').should('contain', '0');
  });

  it('solution', () => {
    cy.intercept('GET', '/api/solutions/problem/1', {
      statusCode: 200,
      body: {
        problemId: 1,
        steps: [0, 4, 8], // solution steps
        moves: 3,
      },
    }).as('getSolution');

    cy.visit('/solutions');
    cy.wait('@getProblems');

    // select a problem
    cy.get('#problems-table-container tbody tr').first().click();

    // get solution
    cy.get('#game-area').contains('button', 'Get solution').click();
    cy.wait('@getSolution');

    cy.get('#game-area app-board').should('exist');
    // board should reset after getting solution
    cy.get('#movescounter').should('contain', '0');
  });

  it('success notification', () => {
    cy.intercept('GET', '/api/problems', {
      statusCode: 200,
      body: [
        {
          id: 1,
          size: 3,
          difficulty: 0.2,
          grid: [1, 1, 1, 1, 1, 0, 1, 0, 0],
          timestamp: '2024-01-01T10:00:00Z',
        },
      ],
    }).as('getProblems');
    cy.visit('/solutions');
    cy.wait('@getProblems');
    
    cy.get('#problems-table-container tbody tr').first().click();
    cy.get('#game-area app-board button').eq(8).click();

    // verify success popup
    cy.get('app-event-popup')
      .should('be.visible')
      .and('contain.text', 'Congratulations! You solved it. 🎉');
  });

  it('failure notification', () => {
    cy.get('#problems-table-container tbody tr').first().click();

    // simulate 5 minutes
    cy.clock();
    cy.get('#game-area app-board button').eq(0).click(); // start
    cy.tick(1000 * 5 * 60 + 1000); // some margin
    cy.get('app-event-popup').should('be.visible').and('contain.text', 'Out of time');
  });

  it('no selection placeholder', () => {
    cy.get('.flex.items-center.justify-center').should('contain.text', 'Select a problem');
  });

  it('moves counter', () => {
    cy.get('#problems-table-container tbody tr').first().click();

    // initial should be 0
    cy.get('#movescounter').contains('0').should('exist');

    cy.get('#game-area app-board button').eq(0).click();
    cy.get('#movescounter').contains('1').should('exist');

    cy.get('#game-area app-board button').eq(1).click();
    cy.get('#movescounter').contains('2').should('exist');

    cy.get('#game-area app-board button').eq(2).click();
    cy.get('#movescounter').contains('3').should('exist');

    cy.get('#game-area app-board button').eq(3).click();
    cy.get('#game-area app-board button').eq(4).click();
    cy.get('#movescounter').contains('5').should('exist');
  });

  it('time countdown', () => {
    cy.get('#problems-table-container tbody tr').first().click();
    
    cy.get('#countdown span').eq(1).should('have.text', '5:00');
    // start
    cy.get('#game-area app-board button').eq(0).click();
    cy.wait(2000);
    cy.get('#countdown span').eq(1).should('not.have.text', '5:00');
    // range 0:00 to 4:59
    cy.get('#countdown span')
      .eq(1)
      .invoke('text')
      .should('match', /^[0-4]:[0-5][0-9]$/);
      
    cy.get('#game-area').contains('button', 'Reset').click();
    cy.get('#countdown span').eq(1).should('have.text', '5:00');
  });
});
