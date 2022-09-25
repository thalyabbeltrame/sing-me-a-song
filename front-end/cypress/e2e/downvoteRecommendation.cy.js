beforeEach(() => {
  cy.task('resetDB');
});

describe('Downvote Recommendation', () => {
  it('Should downvote a recommendation on homepage', () => {
    cy.visit('http://localhost:3000/');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations').as('getRecommendations');

      cy.wait('@getRecommendations').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.length(1);
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      cy.get(`[data-cy=downvote-button]`).click();

      cy.wait('@downvoteRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('score', -1);
      });

      cy.get("[data-cy='score']").should('have.text', '-1');
    });
  });

  it('Should downvote a recommendation on top page', () => {
    cy.visit('http://localhost:3000/top');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations/top/10').as('getTopRecommendations');

      cy.wait('@getTopRecommendations').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.length(1);
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      cy.get(`[data-cy=downvote-button]`).click();

      cy.wait('@downvoteRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('score', -1);
      });

      cy.get("[data-cy='score']").should('have.text', '-1');
    });
  });

  it('Should downvote a recommendation on random page', () => {
    cy.visit('http://localhost:3000/random');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations/random').as('getRandomRecommendation');

      cy.wait('@getRandomRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      cy.get(`[data-cy=downvote-button]`).click();

      cy.wait('@downvoteRecommendation').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('score', -1);
      });

      cy.get("[data-cy='score']").should('have.text', '-1');
    });
  });

  it("Should downvote and delete a recommendation on homepage if it's score is -5", () => {
    cy.visit('http://localhost:3000/');

    cy.createRecommendationOnDB().then(() => {
      cy.intercept('GET', '/recommendations').as('getRecommendations');

      cy.wait('@getRecommendations').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.length(1);
      });

      const numberOfDownvotes = 6;
      for (let i = 0; i < numberOfDownvotes; i++) {
        cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

        cy.get(`[data-cy=downvote-button]`).click();

        cy.wait('@downvoteRecommendation').then(({ response }) => {
          expect(response.statusCode).to.eq(200);
          expect(response.body).to.have.property('score', -1 - i);
        });
      }

      cy.get("[data-cy='score']").should('not.exist');
      cy.get("[data-cy='no-recommendation-msg']").should('exist');
    });
  });
});
