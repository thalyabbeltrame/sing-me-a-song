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

describe('get', () => {
  const newRecommendations =
    recommendationFactory.generateManyRecommendationsRequest();

  it('Should return the list of recommendations', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(newRecommendations as Recommendation[]);

    const result = await recommendationService.get();

    expect(result).toEqual(newRecommendations);
    expect(recommendationRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
