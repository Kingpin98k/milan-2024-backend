import e, { Router } from "express";
import TeamsController from "./controller";
import IUserAuthValidation from "../users/auth/middleware";

const router = Router();

const { execute } = new TeamsController();
const { protect } = new IUserAuthValidation();

router.get("/getUserTeamForEvent/:eventCode/:id", execute);
router.get("/getAllTeams/:userId", execute);
// router.get("/getAllTeamForEvent/:eventCode", protect, execute);
router.get("/getAllTeamForEvent/:eventCode", execute);
router.post("/createTeam", protect, execute);
router.post("/joinTeam", protect, execute);
router.patch("/updateTeamName", protect, execute);
router.delete("/deleteTeam/:teamCode", protect, execute);
router.post("/leaveTeam", protect, execute);
router.post("/deleteTeamMember", protect, execute);

export default router;
