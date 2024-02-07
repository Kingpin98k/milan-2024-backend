import { Router } from "express";

const router = Router();

router.post("/create");
router.post("/join");
router.patch("/updateName");
router.delete("/delete-team/:teamCode");
router.post("/leave");
router.delete("/delete-user/:userId");

export default router;
