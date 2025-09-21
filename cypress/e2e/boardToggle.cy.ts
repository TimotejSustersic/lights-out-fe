// tests for the board toggle functionality
describe('Board Interactions', () => {
  // setup mock API response for a 3x3 grid
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
      ],
    }).as('getProblems');
  });

  const assertGridStates = (expectedStates: number[]) => {
    expectedStates.forEach((state, index) => {
      const expectedClass = state === 1 ? 'bg-yellow-400' : 'bg-gray-700';
      cy.get('app-board button').eq(index).should('have.class', expectedClass);
    });
  };

  describe('Cell Toggles', () => {
    beforeEach(() => {
      cy.visit('/solutions');
      cy.wait('@getProblems');
      cy.get('#problems-table-container tbody tr').first().click();
    });

    // test cases for toggling each cell in a 3x3 grid
    const testCases = [
      {
        name: 'upper-left corner', // (0,0)
        cellIndex: 0,
        expectedStates: [0, 1, 1, 1, 1, 0, 1, 0, 1],
      },
      {
        name: 'upper-middle edge', // (0,1)
        cellIndex: 1,
        expectedStates: [0, 1, 0, 0, 0, 0, 1, 0, 1],
      },
      {
        name: 'upper-right corner', // (0,2)
        cellIndex: 2,
        expectedStates: [1, 1, 0, 0, 1, 1, 1, 0, 1],
      },
      {
        name: 'middle-left edge', // (1,0)
        cellIndex: 3,
        expectedStates: [0, 0, 1, 1, 0, 0, 0, 0, 1],
      },
      {
        name: 'center', // (1,1)
        cellIndex: 4,
        expectedStates: [1, 1, 1, 1, 0, 1, 1, 1, 1],
      },
      {
        name: 'middle-right edge', // (1,2)
        cellIndex: 5,
        expectedStates: [1, 0, 0, 0, 0, 1, 1, 0, 0],
      },
      {
        name: 'lower-left corner', // (2,0)
        cellIndex: 6,
        expectedStates: [1, 0, 1, 1, 1, 0, 0, 1, 1],
      },
      {
        name: 'lower-middle edge', // (2,1)
        cellIndex: 7,
        expectedStates: [1, 0, 1, 0, 0, 0, 0, 1, 0],
      },
      {
        name: 'lower-right corner', // (2,2)
        cellIndex: 8,
        expectedStates: [1, 0, 1, 0, 1, 1, 1, 1, 0],
      },
    ];

    testCases.forEach(({ name, cellIndex, expectedStates }) => {
      it(`toggle ${name}`, () => {
        // toggle cell
        cy.get('app-board button').eq(cellIndex).click();
        assertGridStates(expectedStates);
      });
    });
  });

  describe('Additional Toggle Behaviors', () => {
    beforeEach(() => {
      cy.visit('/solutions');
      cy.wait('@getProblems');
      cy.get('#problems-table-container tbody tr').first().click();
    });

    it('toggle same cell twice', () => {
      const originalStates = [1, 0, 1, 0, 1, 0, 1, 0, 1];
      // double click center cell
      cy.get('app-board button').eq(4).click().click();
      assertGridStates(originalStates);
    });

    it('handle multiple cell clicks', () => {
      cy.get('app-board button').eq(0).click();
      cy.get('app-board button').eq(1).click();
      cy.get('app-board button').eq(2).click();

      const expectedStates = [1, 1, 1, 1, 0, 1, 1, 0, 1];
      assertGridStates(expectedStates);
    });
  });
});
