import { Router } from 'express';

import { recommendationRepository } from '../repositories/recommendationRepository';

export const e2eRouter = Router();

e2eRouter.delete('/reset-db', async (_req, res) => {
  await recommendationRepository.resetDB();
  res.sendStatus(200);
});
