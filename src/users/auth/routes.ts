import { Router, response } from "express";
import UsersAuthController from "./controller";
import IUserAuthValidation from "./middleware";
import dotenv from "dotenv";
dotenv.config();
const router: Router = Router();

const { execute } = new UsersAuthController();
const { protect } = new IUserAuthValidation();

router.post("/login", execute);
router.get("/logout", execute);
router.post("/register", execute);
router.get("/current", protect, execute);
router.delete("/delete", protect, execute);

export default router;
