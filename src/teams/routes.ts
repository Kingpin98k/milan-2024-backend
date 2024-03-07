import e, { Router } from "express";
import TeamsController from "./controller";
import IUserAuthValidation from "../users/auth/middleware";

const router = Router();

const { execute } = new TeamsController();
const { protect } = new IUserAuthValidation();

router.get("/getAllTeams/:userId", execute);
router.get("/getUserTeamForEvent/:eventCode", protect, execute);
router.post("/createTeam", protect, execute);
router.post("/joinTeam", protect, execute);
router.patch("/updateTeamName", protect, execute);
router.delete("/deleteTeam/:teamCode", protect, execute);
router.post("/leaveTeam", protect, execute);
router.post("/deleteTeamMember", protect, execute);

export default router;
