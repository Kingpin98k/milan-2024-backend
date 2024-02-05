import { Router } from "express";
import { param } from "express-validator";
import StaffController from "./controllers";

const router = Router();

const { execute } = new StaffController();

router.get("/", execute);
router.post("/register", execute);
router.post("/forgotpassword", execute);
router.post("/login", execute);
router.post("/verify", execute);
router.post("/deny", execute);
router.delete("/:staffId", param("staffId").escape(), execute);

export default router;
