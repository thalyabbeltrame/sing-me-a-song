import { jest } from '@jest/globals';
import { Recommendation } from '@prisma/client';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('getTop', () => {
  it('Should return the top recommendations', async () => {
    const newRecommendations =
      recommendationFactory.generateManyRecommendationsRequest(10);

    newRecommendations.map((recommendation, index) => {
      recommendation.score = index + 1;
    });

    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockResolvedValue(newRecommendations as Recommendation[]);

    const result = await recommendationService.getTop(10);

    expect(result).toEqual(newRecommendations);
    expect(recommendationRepository.getAmountByScore).toHaveBeenCalledTimes(1);
  });
});
