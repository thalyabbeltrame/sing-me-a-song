import { PrismaClient, Recommendation } from '@prisma/client';
import supertest from 'supertest';

import { app } from '../src/app';
import { recommendationFactory } from './factories/recommendationFactory';

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

afterAll(async () => {
  prisma.$disconnect();
});

describe('GET /recommendations/top/:amount', () => {
  const newRecommendations =
    recommendationFactory.generateManyRecommendationsRequest(10);

  newRecommendations.map((recommendation, index) => {
    recommendation.score = index + 1;
  });

  it('Should return 200 and the top recommendations', async () => {
    const amount = await recommendationFactory.insertManyRecommendationsOnDB(
      newRecommendations
    );

    const response = await supertest(app)
      .get(`/recommendations/top/${amount}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(amount);
    expect(response.body).toBeInstanceOf(Array<Recommendation>);
    expect(response.body[0].score).toBe(amount);
  });
});
