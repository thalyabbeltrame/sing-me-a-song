beforeEach(() => {
  cy.task('resetDB');
});

describe('Upvote Recommendation', () => {
  it('Should upvote a recommendation on homepage', () => {
    cy.visit('http://localhost:3000/');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations').as('getRecommendations');

      cy.wait('@getRecommendations').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.length(1);
      });

      cy.intercept('POST', `/recommendations/1/upvote`).as('upvoteRecommendation');

      cy.get(`[data-cy=upvote-button]`).click();

      cy.wait('@upvoteRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('score', 1);
      });

      cy.get("[data-cy='score']").should('have.text', '1');
    });
  });

  it('Should upvote a recommendation on top page', () => {
    cy.visit('http://localhost:3000/top');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations/top/10').as('getTopRecommendations');

      cy.wait('@getTopRecommendations').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.length(1);
      });

      cy.intercept('POST', `/recommendations/1/upvote`).as('upvoteRecommendation');

      cy.get(`[data-cy=upvote-button]`).click();

      cy.wait('@upvoteRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('score', 1);

        cy.get("[data-cy='score']").should('have.text', '1');
      });
    });
  });

  it('Should upvote a recommendation on random page', () => {
    cy.visit('http://localhost:3000/random');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations/random').as('getRandomRecommendation');

      cy.wait('@getRandomRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });

      cy.intercept('POST', `/recommendations/1/upvote`).as('upvoteRecommendation');

      cy.get(`[data-cy=upvote-button]`).click();

      cy.wait('@upvoteRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('score', 1);

        cy.get("[data-cy='score']").should('have.text', '1');
      });
    });
  });
});
