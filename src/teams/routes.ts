import e, { Router } from "express";
import TeamsController from "./controller";

const router = Router();

const { execute } = new TeamsController();

router.get("/getAllTeam/:userId", execute);
router.post("/create", execute);
router.post("/join", execute);
router.patch("/updateName", execute);
router.delete("/deleteTeam/:teamCode", execute);
router.post("/leave", execute);
router.post("/deleteMember", execute);

export default router;
