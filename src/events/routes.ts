import ErrorHandler from '../utils/errors.handler';
import { NextFunction, Request, Response, Router } from 'express';
import EventsController from './controller';

const router = Router();

console.log('Executing events/routes.ts');

const { execute } = new EventsController();
router.get('/event', execute);
router.post('/event', execute);
router.get('/event/:code', execute);
router.delete('/event/:code', execute);

export default router;
