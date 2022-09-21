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

describe('GET /recommendations', () => {
  it('Should return 200 and the list of recommendations', async () => {
    const newRecommendation = recommendationFactory.createNew();
    await prisma.recommendation.create({
      data: newRecommendation,
    });

    const response = await supertest(app).get('/recommendations').send();

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array<Recommendation>);
  });
});
