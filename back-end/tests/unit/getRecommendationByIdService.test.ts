import { jest } from '@jest/globals';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getById', () => {
  const newRecommendation =
    recommendationFactory.generateRecommendationRequest();

  const recommendationResponse = {
    id: 1,
    ...newRecommendation,
    score: 0,
  };

  it('Should return the recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendationResponse);

    const result = await recommendationService.getById(
      recommendationResponse.id
    );

    expect(result).toEqual(recommendationResponse);
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendationResponse.id
    );
  });

  it('Should throw an error if the recommendation does not exist', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    const result = recommendationService.getById(recommendationResponse.id);

    expect(result).rejects.toEqual({ type: 'not_found', message: '' });
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendationResponse.id
    );
  });
});
