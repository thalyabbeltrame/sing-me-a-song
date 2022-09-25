import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.task('resetDB');
});

describe('Create Recommendation', () => {
  const newRecommendation = {
    name: faker.name.fullName(),
    youtubeLink: `https://www.youtube.com/${faker.lorem.words(1)}`,
  };

  it('Should create a recommendation', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-cy=name-input]').type(newRecommendation.name);
    cy.get('[data-cy=youtube-link-input]').type(newRecommendation.youtubeLink);

    cy.intercept('POST', '/recommendations').as('createRecommendation');

    cy.get('[data-cy=recommendation-submit-button]').click();

    cy.wait('@createRecommendation').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body).to.have.property('name', newRecommendation.name);
    });
  });

  it('Should throw an error if the recommendation already exists', async () => {
    cy.visit('http://localhost:3000/');

    cy.createRecommendationOnDB().then((recommendation) => {
      cy.get('[data-cy=name-input]').type(recommendation.name);
      cy.get('[data-cy=youtube-link-input]').type(recommendation.youtubeLink);

      cy.intercept('POST', '/recommendations').as('createRecommendation');

      cy.get('[data-cy=recommendation-submit-button]').click();

      cy.wait('@createRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(409);
        expect(response.body).to.have.property('message', 'Recommendations names must be unique');
      });

      cy.on('window:alert', (str) => {
        expect(str).to.equal('Error creating recommendation!');
      });
    });
  });

  it('Should throw an error if the recommendation name is empty', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-cy=youtube-link-input]').type(newRecommendation.youtubeLink);

    cy.intercept('POST', '/recommendations').as('createRecommendation');

    cy.get('[data-cy=recommendation-submit-button]').click();

    cy.wait('@createRecommendation').then(({ response }) => {
      expect(response.statusCode).to.eq(422);
      expect(response.body).to.have.property('message', '');
    });

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Error creating recommendation!');
    });
  });
});
