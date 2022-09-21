import { Router } from 'express';

import { recommendationRouter } from './recommendationRouter';

export const router = Router();

router.use('/recommendations', recommendationRouter);
