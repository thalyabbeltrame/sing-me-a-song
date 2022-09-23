import { jest } from '@jest/globals';

import { recommendationFactory } from '../factories/recommendationFactory';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('upvote', () => {
  const newRecommendation =
    recommendationFactory.generateRecommendationRequest();

  const recommendationResponse = {
    id: 1,
    ...newRecommendation,
    score: 0,
  };

  it('Should upvote a recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendationResponse);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce({ ...recommendationResponse, score: 0 });

    const result = await recommendationService.upvote(
      recommendationResponse.id
    );

    expect(result).toEqual(recommendationResponse);
    expect(recommendationRepository.find).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if the recommendation does not exist', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    const result = recommendationService.upvote(recommendationResponse.id);

    expect(result).rejects.toEqual({
      type: 'not_found',
      message: '',
    });
    expect(recommendationRepository.find).toHaveBeenCalledTimes(1);
  });
});
