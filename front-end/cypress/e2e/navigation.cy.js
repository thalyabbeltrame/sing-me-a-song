import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.task('resetDB');
});

describe('Navigation', () => {
  it('Should navigate to the home page', () => {
    cy.visit('http://localhost:3000/top');

    cy.get('[data-cy=home-page-button]').click();

    cy.url().should('equal', 'http://localhost:3000/');
  });

  it('Should navigate to the top page', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-cy=top-page-button]').click();

    cy.url().should('equal', 'http://localhost:3000/top');
  });

  it('Should navigate to the random page', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-cy=random-page-button]').click();

    cy.url().should('equal', 'http://localhost:3000/random');
  });

  it('Should render "Not Found!" message if page does not exist', () => {
    cy.visit(`http://localhost:3000/${faker.random.word()}`);

    cy.contains('Not found!').should('be.visible');
  });
});
