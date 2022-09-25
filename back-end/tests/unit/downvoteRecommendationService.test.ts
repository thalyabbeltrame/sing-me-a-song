import { jest } from '@jest/globals';

import { recommendationFactory } from '../factories/recommendationFactory';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('downvote', () => {
  const newRecommendation =
    recommendationFactory.generateRecommendationRequest();

  const recommendationResponse = {
    id: 1,
    ...newRecommendation,
    score: 0,
  };

  it('Should downvote a recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendationResponse);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce({ ...recommendationResponse, score: -1 });

    const result = await recommendationService.downvote(
      recommendationResponse.id
    );

    expect(result).toEqual({ ...recommendationResponse, score: -1 });
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendationResponse.id
    );
    expect(recommendationRepository.updateScore).toHaveBeenCalledWith(
      recommendationResponse.id,
      'decrement'
    );
  });

  it('Should downvote a recommendation and remove it if the score is less than -5', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce({ ...recommendationResponse, score: -5 });
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce({ ...recommendationResponse, score: -6 });
    jest
      .spyOn(recommendationRepository, 'remove')
      .mockResolvedValueOnce({ ...recommendationResponse, score: -6 });

    const result = await recommendationService.downvote(
      recommendationResponse.id
    );

    expect(result).toEqual({ ...recommendationResponse, score: -6 });
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendationResponse.id
    );
    expect(recommendationRepository.updateScore).toHaveBeenCalledWith(
      recommendationResponse.id,
      'decrement'
    );
    expect(recommendationRepository.remove).toHaveBeenCalledWith(
      recommendationResponse.id
    );
  });

  it('Should throw an error if the recommendation does not exist', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    const result = recommendationService.upvote(recommendationResponse.id);

    expect(result).rejects.toEqual({
      type: 'not_found',
      message: '',
    });
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendationResponse.id
    );
    expect(recommendationRepository.updateScore).not.toHaveBeenCalled();
    expect(recommendationRepository.remove).not.toHaveBeenCalled();
  });
});
