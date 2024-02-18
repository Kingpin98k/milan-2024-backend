import ErrorHandler from '../utils/errors.handler';
import { NextFunction, Request, Response, Router } from 'express';
import EventsController from './controller';
import IUserAuthValidation from '../users/auth/middleware';

const router = Router();

console.log('Executing events/routes.ts');

const { execute } = new EventsController();
const { protect } = new IUserAuthValidation();

router.get('/', execute);
router.get('/:code', execute);
router.post('/register', execute);
router.delete('/unregister', execute);
router.delete('/:code', execute);
router.post('/event', execute);
router.get('/geteventbyclub/:club', execute);
router.get('/getallusersbycode/:code', execute);
router.get('/getcountbycode/:code', execute);
router.patch('/updateMaxCap/:code/:new_cap', execute);
router.patch('/activate-event/:code/:op', execute);

// router.get('/event', protect, execute);
// router.get('/event/:code', protect, execute);
// router.post('/register', protect, execute);
// router.delete('/unregister',protect, execute);
// router.delete('/:code', protect, execute);
// router.post('/event', protect, execute);
// router.get('/geteventbyclub', protect, execute);
// router.get('/getalluserbycode/:code', protect, execute);
// router.patch('/updateMaxCap/:code/:new_cap', protect, execute);
// router.patch('/activate-event/:code/:op', protect, execute);

export default router;
