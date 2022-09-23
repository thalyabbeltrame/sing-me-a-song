import { jest } from '@jest/globals';

import { recommendationFactory } from '../factories/recommendationFactory';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('insert', () => {
  const newRecommendation =
    recommendationFactory.generateRecommendationRequest();

  const recommendationResponse = {
    id: 1,
    ...newRecommendation,
    score: 0,
  };

  it('Should create a recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(null);
    jest
      .spyOn(recommendationRepository, 'create')
      .mockResolvedValueOnce(recommendationResponse);

    const result = await recommendationService.insert(newRecommendation);

    expect(result).toEqual(recommendationResponse);
    expect(recommendationRepository.create).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.create).toHaveBeenCalledWith(
      newRecommendation
    );
  });

  it('Should throw an error if the recommendation already exists', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(recommendationResponse);

    const result = recommendationService.insert(newRecommendation);

    expect(result).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique',
    });
    expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1);
  });
});
