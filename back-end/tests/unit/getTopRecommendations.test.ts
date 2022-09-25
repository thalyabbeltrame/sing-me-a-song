import { jest } from '@jest/globals';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getTop', () => {
  const amount = 10;
  const newRecommendations =
    recommendationFactory.generateManyRecommendationsRequest(amount);

  const recommendationsResponse = newRecommendations.map(
    (recommendation, index) => ({
      id: index + 1,
      ...recommendation,
      score: amount - index,
    })
  );

  it('Should return the top recommendations', async () => {
    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockResolvedValue(recommendationsResponse);

    const result = await recommendationService.getTop(amount);

    expect(result).toEqual(recommendationsResponse);
    expect(recommendationRepository.getAmountByScore).toHaveBeenCalledWith(
      amount
    );
  });
});
