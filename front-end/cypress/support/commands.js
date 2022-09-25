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
import { faker } from '@faker-js/faker';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

Cypress.Commands.add('createRecommendationOnDB', () => {
  const newRecommendation = {
    name: faker.name.fullName(),
    youtubeLink: `https://www.youtube.com/${faker.lorem.words(1)}`,
  };

  cy.request({
    method: 'POST',
    url: `${API_BASE_URL}/recommendations`,
    body: newRecommendation,
    failOnStatusCode: false,
  }).then((res) => cy.wrap(JSON.parse(res.requestBody)));
});
