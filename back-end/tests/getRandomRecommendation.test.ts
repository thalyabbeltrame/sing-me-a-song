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

describe('GET /recommendations/random', () => {
  it('Should return 200 and a random recommendation', async () => {
    const newRecommendation = recommendationFactory.createNew();
    await prisma.recommendation.createMany({
      data: [
        { ...newRecommendation, score: 20 },
        { ...newRecommendation, name: 'Another name', score: 10 },
      ],
    });

    const response = await supertest(app).get('/recommendations/random');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        youtubeLink: expect.any(String),
        score: expect.any(Number),
      })
    );
  });

  it('Should return 404 if there are no recommendations', async () => {
    const response = await supertest(app).get('/recommendations/random');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      type: 'not_found',
      message: '',
    });
  });
});
