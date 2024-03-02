import ErrorHandler from "../utils/errors.handler";
import { NextFunction, Request, Response, Router } from "express";
import EventsController from "./controller";
import IUserAuthValidation from "../users/auth/middleware";
<<<<<<< HEAD
import logger, { LogTypes } from "../utils/logger";

const router = Router();

=======

const router = Router();

// console.log('Executing events/routes.ts');

>>>>>>> e4b43e6e0f7e2a72cfdb829f382e817059ec3a24
const { execute } = new EventsController();
const { protect } = new IUserAuthValidation();

router.get("/", execute);
<<<<<<< HEAD
router.get("/getEvent/:user_id", execute);
router.get("/:code", execute);
router.get("/getEventByClub/:club", execute);
router.get("/getAllUsersByCode/:code", execute);
router.get("/getCountByCode/:code", execute);
router.post("/register", execute);
router.post("/event", execute);
router.patch("/updateMaxCap/:code/:new_cap", execute);
router.patch("/activateEvent/:code/:op", execute);
router.delete("/unregister", execute);
router.delete("/:code", execute);
=======
router.get("/:code", execute);
router.post("/register", execute);
router.delete("/unregister", execute);
router.delete("/:code", execute);
router.post("/event", execute);
router.get("/getEventByClub/:club", execute);
router.get("/getAllUsersByCode/:code", execute);
router.get("/getCountByCode/:code", execute);
router.patch("/updateMaxCap/:code/:new_cap", execute);
router.patch("/activateEvent/:code/:op", execute);
router.get("/getEvent/:user_id", execute);
>>>>>>> e4b43e6e0f7e2a72cfdb829f382e817059ec3a24

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
