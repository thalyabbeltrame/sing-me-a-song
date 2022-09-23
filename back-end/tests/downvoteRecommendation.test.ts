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

describe('POST /recommendations/:id/downvote', () => {
  it('Should return 200 and the updated recommendation', async () => {
    const newRecommendation = recommendationFactory.createNew();
    const createdRecommendation = await prisma.recommendation.create({
      data: newRecommendation,
    });

    const response = await supertest(app)
      .post(`/recommendations/${createdRecommendation.id}/downvote`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...createdRecommendation, score: -1 });
  });

  it('Should return 200 and delete the recommendation if score is -5', async () => {
    const newRecommendation = recommendationFactory.createNew();
    const createdRecommendation = await prisma.recommendation.create({
      data: { ...newRecommendation, score: -5 },
    });

    const response = await supertest(app)
      .post(`/recommendations/${createdRecommendation.id}/downvote`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...createdRecommendation, score: -6 });

    const deletedRecommendation = await prisma.recommendation.findUnique({
      where: { id: createdRecommendation.id },
    });

    expect(deletedRecommendation).toBeNull();
  });

  it('Should return 404 if the recommendation does not exist', async () => {
    const response = await supertest(app)
      .post('/recommendations/1/upvote')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ type: 'not_found', message: '' });
  });
});
