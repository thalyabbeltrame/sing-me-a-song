import { faker } from '@faker-js/faker';
import { PrismaClient, Recommendation } from '@prisma/client';

const prisma = new PrismaClient();

interface RecommendationRequest {
  name: string;
  youtubeLink: string;
  score?: number;
}

function generateRecommendationRequest(): RecommendationRequest {
  return {
    name: faker.name.fullName(),
    youtubeLink: `https://www.youtube.com/${faker.lorem.words(1)}`,
  };
}

function generateManyRecommendationsRequest(
  amount: number = 2
): RecommendationRequest[] {
  return Array.from({ length: amount }, () => generateRecommendationRequest());
}

async function insertRecommendationOnDB(
  recommendation: RecommendationRequest
): Promise<Recommendation> {
  return await prisma.recommendation.create({
    data: recommendation,
  });
}

async function insertManyRecommendationsOnDB(
  recommendations: RecommendationRequest[]
): Promise<number> {
  const { count } = await prisma.recommendation.createMany({
    data: recommendations,
  });

  return count;
}

async function findRecommendationOnDB(
  id: number
): Promise<Recommendation | null> {
  return await prisma.recommendation.findUnique({
    where: { id },
  });
}

export const recommendationFactory = {
  generateRecommendationRequest,
  generateManyRecommendationsRequest,
  insertRecommendationOnDB,
  insertManyRecommendationsOnDB,
  findRecommendationOnDB,
};
