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

describe('POST /recommendations', () => {
  const newRecommendation = recommendationFactory.createNew();

  it('Should return 201 and the created recommendation', async () => {
    const response = await supertest(app)
      .post('/recommendations')
      .send(newRecommendation);

    delete response.body.id;
    delete response.body.score;

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newRecommendation);
  });

  it('Should return 409 if the name is already in use', async () => {
    await prisma.recommendation.create({
      data: newRecommendation,
    });

    const response = await supertest(app)
      .post('/recommendations')
      .send(newRecommendation);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('type');
  });

  it('Should return 422 when body is invalid', async () => {
    const response = await supertest(app)
      .post('/recommendations')
      .send({
        ...newRecommendation,
        name: '',
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('type');
  });
});
