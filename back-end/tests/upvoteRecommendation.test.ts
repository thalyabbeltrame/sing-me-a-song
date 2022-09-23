import { PrismaClient } from '@prisma/client';
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

describe('POST /recommendations/:id/upvote', () => {
  it('Should return 200 and the updated recommendation', async () => {
    const newRecommendation = recommendationFactory.createNew();
    const createdRecommendation = await prisma.recommendation.create({
      data: newRecommendation,
    });

    const response = await supertest(app)
      .post(`/recommendations/${createdRecommendation.id}/upvote`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...createdRecommendation, score: 1 });
  });

  it('Should return 404 if the recommendation does not exist', async () => {
    const response = await supertest(app)
      .post('/recommendations/1/upvote')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      type: 'not_found',
      message: '',
    });
  });
});
