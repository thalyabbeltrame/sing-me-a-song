beforeEach(() => {
  cy.task('resetDB');
});

describe('Downvote Recommendation', () => {
  it('Should downvote a recommendation on homepage', () => {
    cy.visit('http://localhost:3000/');

    cy.createRecommendationOnDB().then((recommendation) => {
      cy.intercept('GET', '/recommendations').as('getRecommendations');

      cy.wait('@getRecommendations').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.length(1);
        expect(interception.response.body[0]).to.have.property('name', recommendation.name);
        expect(interception.response.body[0]).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      cy.get(`[data-cy=downvote-button]`).click();

      cy.wait('@downvoteRecommendation').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('name', recommendation.name);
        expect(interception.response.body).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
        expect(interception.response.body).to.have.property('score', -1);

        cy.get("[data-cy='score']").should('have.text', '-1');
      });
    });
  });

  it('Should downvote a recommendation on top page', () => {
    cy.visit('http://localhost:3000/top');

    cy.createRecommendationOnDB().then((recommendation) => {
      cy.intercept('GET', '/recommendations/top/10').as('getTopRecommendations');

      cy.wait('@getTopRecommendations').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.length(1);
        expect(interception.response.body[0]).to.have.property('name', recommendation.name);
        expect(interception.response.body[0]).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      cy.get(`[data-cy=downvote-button]`).click();

      cy.wait('@downvoteRecommendation').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('name', recommendation.name);
        expect(interception.response.body).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
        expect(interception.response.body).to.have.property('score', -1);

        cy.get("[data-cy='score']").should('have.text', '-1');
      });
    });
  });

  it('Should downvote a recommendation on random page', () => {
    cy.visit('http://localhost:3000/random');

    cy.createRecommendationOnDB().then((recommendation) => {
      cy.intercept('GET', '/recommendations/random').as('getRandomRecommendation');

      cy.wait('@getRandomRecommendation').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('name', recommendation.name);
        expect(interception.response.body).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      cy.get(`[data-cy=downvote-button]`).click();

      cy.wait('@downvoteRecommendation').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('name', recommendation.name);
        expect(interception.response.body).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
        expect(interception.response.body).to.have.property('score', -1);

        cy.get("[data-cy='score']").should('have.text', '-1');
      });
    });
  });

  it("Should downvote and delete a recommendation on homepage if it's score is -5", () => {
    cy.visit('http://localhost:3000/');

    cy.createRecommendationOnDB().then((recommendation) => {
      cy.intercept('GET', '/recommendations').as('getRecommendations');

      cy.wait('@getRecommendations').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.length(1);
        expect(interception.response.body[0]).to.have.property('name', recommendation.name);
        expect(interception.response.body[0]).to.have.property(
          'youtubeLink',
          recommendation.youtubeLink
        );
      });

      cy.intercept('POST', `/recommendations/1/downvote`).as('downvoteRecommendation');

      const numberOfDownvotes = 6;
      for (let i = 0; i < numberOfDownvotes; i++) {
        cy.get(`[data-cy=downvote-button]`).click();
      }

      cy.wait('@downvoteRecommendation');

      cy.get("[data-cy='score']").should('not.exist');
    });
  });
});
