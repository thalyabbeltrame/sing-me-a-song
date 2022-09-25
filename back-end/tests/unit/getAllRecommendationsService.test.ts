import { jest } from '@jest/globals';
import { Recommendation } from '@prisma/client';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('get', () => {
  const newRecommendations =
    recommendationFactory.generateManyRecommendationsRequest();

  const recommendationsResponse = newRecommendations.map(
    (recommendation, index) => ({
      id: index + 1,
      ...recommendation,
      score: 0,
    })
  );

  it('Should return the list of recommendations', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(recommendationsResponse);

    const result = await recommendationService.get();

    expect(result).toEqual(recommendationsResponse);
    expect(recommendationRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
