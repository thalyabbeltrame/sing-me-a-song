import { jest } from '@jest/globals';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationFactory } from '../factories/recommendationFactory';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getRandom', () => {
  const amount = 10;
  const newRecommendations =
    recommendationFactory.generateManyRecommendationsRequest(amount);

  it('Should return a random recommendation with score greater than 10', async () => {
    const recommendationsResponse = newRecommendations.map(
      (recommendation, index) => ({
        id: index + 1,
        ...recommendation,
        score: index + 11,
      })
    );

    jest.spyOn(Math, 'random').mockReturnValue(0.3);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(recommendationsResponse);
    jest.spyOn(Math, 'floor').mockReturnValue(0);

    const result = await recommendationService.getRandom();

    expect(result).toEqual(recommendationsResponse[0]);
    expect(result.score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.findAll).toHaveBeenCalledWith({
      score: 10,
      scoreFilter: 'gt',
    });
  });

  it('Should return a random recommendation with score less than or equal to 10', async () => {
    const recommendationsResponse = newRecommendations.map(
      (recommendation, index) => ({
        id: index + 1,
        ...recommendation,
        score: index - 5,
      })
    );

    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(recommendationsResponse);
    jest.spyOn(Math, 'floor').mockReturnValue(0);

    const result = await recommendationService.getRandom();

    expect(result).toEqual(recommendationsResponse[0]);
    expect(result.score).toBeLessThanOrEqual(10);
    expect(recommendationRepository.findAll).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.findAll).toHaveBeenCalledWith({
      score: 10,
      scoreFilter: 'lte',
    });
  });

  it('Should return any random recommendation', async () => {
    const recommendationsResponse = newRecommendations.map(
      (recommendation, index) => ({
        id: index + 1,
        ...recommendation,
        score: index + 11,
      })
    );

    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(recommendationsResponse);
    jest.spyOn(Math, 'floor').mockReturnValue(0);

    const result = await recommendationService.getRandom();

    expect(result).toEqual(recommendationsResponse[0]);
  });

  it('Should throw an error if there are no recommendations', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    const result = recommendationService.getRandom();

    expect(result).rejects.toEqual({ type: 'not_found', message: '' });
  });
});
