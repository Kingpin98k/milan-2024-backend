import { Router } from "express";
import { param } from "express-validator";
import StaffController from "./controllers";
import IStaffValidation from "./middleware";

const router = Router();

const { execute } = new StaffController();
const { protectStaff, adminAccess } = new IStaffValidation();

router.get("/", protectStaff, adminAccess, execute);
router.post("/register", execute);
router.post("/forgotpassword", protectStaff, execute);
router.post("/login", execute);
router.post("/verify", protectStaff, execute);
router.post("/deny", protectStaff, execute);
router.delete("/:staffId", protectStaff, param("staffId").escape(), execute);
router.get("/logout", protectStaff, execute);

export default router;
