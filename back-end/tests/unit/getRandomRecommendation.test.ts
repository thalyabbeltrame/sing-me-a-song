import { jest } from '@jest/globals';
import { Recommendation } from '@prisma/client';
import { json } from 'stream/consumers';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('getRandom', () => {
  const newRecommendations =
    recommendationFactory.generateManyRecommendationsRequest(10);

  it('Should return a random recommendation with score greater than 10', async () => {
    newRecommendations.map((recommendation, index) => {
      recommendation.score = index + 11;
    });

    jest.spyOn(Math, 'random').mockReturnValue(0.3);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(newRecommendations as Recommendation[]);
    jest.spyOn(Math, 'floor').mockReturnValue(0);

    const result = await recommendationService.getRandom();

    expect(result).toEqual(newRecommendations[0]);
    expect(result.score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toHaveBeenCalledWith({
      score: 10,
      scoreFilter: 'gt',
    });
  });

  it('Should return a random recommendation with score less than or equal to 10', async () => {
    newRecommendations.map((recommendation, index) => {
      recommendation.score = index - 5;
    });

    jest.spyOn(Math, 'random').mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(newRecommendations as Recommendation[]);
    jest.spyOn(Math, 'floor').mockReturnValue(0);

    const result = await recommendationService.getRandom();

    expect(result).toEqual(newRecommendations[0]);
    expect(result.score).toBeLessThanOrEqual(10);
    expect(recommendationRepository.findAll).toHaveBeenCalledWith({
      score: 10,
      scoreFilter: 'lte',
    });
  });

  it('Should return any random recommendation', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(newRecommendations as Recommendation[]);
    jest.spyOn(Math, 'floor').mockReturnValue(0);

    const result = await recommendationService.getRandom();

    expect(result).toEqual(newRecommendations[0]);
  });

  it('Should throw an error if there are no recommendations', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    const result = recommendationService.getRandom();

    expect(result).rejects.toEqual({ type: 'not_found', message: '' });
  });
});
