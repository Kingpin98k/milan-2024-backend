import ErrorHandler from '../utils/errors.handler';
import { NextFunction, Request, Response, Router } from 'express';
import EventsController from './controller';

const router = Router();

console.log('Executing events/routes.ts');

const { execute } = new EventsController();
router.get('/events', execute);
router.post('/events', execute);

export default router;
