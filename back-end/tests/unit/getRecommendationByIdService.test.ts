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

describe('getById', () => {
  const newRecommendation =
    recommendationFactory.generateRecommendationRequest();

  it('Should return the recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(newRecommendation as Recommendation);

    const result = await recommendationService.getById(1);

    expect(result).toEqual(newRecommendation);
    expect(recommendationRepository.find).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if the recommendation does not exist', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    const result = recommendationService.getById(1);

    expect(result).rejects.toEqual({ type: 'not_found', message: '' });
    expect(recommendationRepository.find).toHaveBeenCalledTimes(1);
  });
});
