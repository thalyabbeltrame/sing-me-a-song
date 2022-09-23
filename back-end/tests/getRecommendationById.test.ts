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

describe('GET /recommendations/:id', () => {
  it('Should return 200 and the recommendation', async () => {
    const newRecommendation = recommendationFactory.createNew();
    const createdRecommendation = await prisma.recommendation.create({
      data: newRecommendation,
    });

    const response = await supertest(app)
      .get(`/recommendations/${createdRecommendation.id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdRecommendation);
  });

  it('Should return 404 if the recommendation does not exist', async () => {
    const response = await supertest(app).get('/recommendations/1').send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      type: 'not_found',
      message: '',
    });
  });
});
