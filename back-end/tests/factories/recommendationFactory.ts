import { faker } from '@faker-js/faker';

interface RecommendationRequest {
  name: string;
  youtubeLink: string;
}

function createNew(): RecommendationRequest {
  return {
    name: faker.name.fullName(),
    youtubeLink: `https://www.youtube.com/${faker.lorem.words(1)}`,
  };
}

export const recommendationFactory = {
  createNew,
};
