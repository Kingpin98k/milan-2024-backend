import { Router } from "express";
import { param } from "express-validator";
import StaffController from "./controllers";
import IStaffValidation from "./middleware";

const router = Router();

const { execute } = new StaffController();
const { protectStaff, adminAccess, viewerAndAdminAccess } =
	new IStaffValidation();
	
router.get("/getUserByUserID/:userId", execute);

router.get("/current", protectStaff, execute);
router.get("/", protectStaff, viewerAndAdminAccess, execute);
router.get(
	"/getOfflineTicketsIssued",
	protectStaff,
	viewerAndAdminAccess,
	execute
);
router.get(
	"/getTotalRegistrations",
	protectStaff,
	viewerAndAdminAccess,
	execute
);
router.get("/getTotalTicketsSold", protectStaff, viewerAndAdminAccess, execute);
router.post("/getUserIdByEmail", protectStaff, viewerAndAdminAccess, execute);
router.post("/getBookingByEmail", protectStaff, viewerAndAdminAccess, execute);
router.post("/register", execute);
router.post("/forgotpassword", protectStaff, execute);
router.post("/login", execute);
router.post("/verify", protectStaff, execute);
router.post("/deny", protectStaff, execute);
router.get("/logout", execute);
router.delete("/deleteUser/:userId", protectStaff, adminAccess, execute);
router.delete("/deleteStaff/:staffId", protectStaff, param("staffId").escape(), execute);
// router.get("/getUserByUserID/:userId", protectStaff, adminAccess, execute);
export default router;
