import { Request, Response } from 'express';

import { recommendationSchema } from '../schemas/recommendationsSchemas';
import { recommendationService } from '../services/recommendationsService';
import { wrongSchemaError } from '../utils/errorUtils';

async function insert(req: Request, res: Response) {
  const validation = recommendationSchema.validate(req.body);
  if (validation.error) {
    throw wrongSchemaError();
  }

  const recommendation = await recommendationService.insert(req.body);

  res.status(201).send(recommendation);
}

async function upvote(req: Request, res: Response) {
  const id = parseInt(req.params.id) || 0;

  const recommendation = await recommendationService.upvote(+id);

  res.status(200).send(recommendation);
}

async function downvote(req: Request, res: Response) {
  const id = parseInt(req.params.id) || 0;

  const recommendation = await recommendationService.downvote(+id);

  res.status(200).send(recommendation);
}

async function random(req: Request, res: Response) {
  const randomRecommendation = await recommendationService.getRandom();

  res.status(200).send(randomRecommendation);
}

async function get(req: Request, res: Response) {
  const recommendations = await recommendationService.get();

  res.status(200).send(recommendations);
}

async function getTop(req: Request, res: Response) {
  const amount = parseInt(req.params.amount) || 0;

  const recommendations = await recommendationService.getTop(+amount);

  res.status(200).send(recommendations);
}

async function getById(req: Request, res: Response) {
  const id = parseInt(req.params.id) || 0;

  const recommendation = await recommendationService.getById(+id);

  res.status(200).send(recommendation);
}

export const recommendationController = {
  insert,
  upvote,
  downvote,
  random,
  getTop,
  get,
  getById,
};
