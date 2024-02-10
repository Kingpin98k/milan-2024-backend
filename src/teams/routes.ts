import { Router } from "express";
import TeamsController from "./controller";

const router = Router();

const { execute } = new TeamsController();

router.post("/create", execute);
router.post("/join", execute);
router.patch("/updateName");
router.delete("/delete-team/:teamCode");
router.post("/leave");
router.delete("/delete-user/:userId");

export default router;
