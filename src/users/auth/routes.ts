import { Router, response } from "express";
import UsersAuthController from "./controller";
import IUserAuthValidation from "./middleware";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const router: Router = Router();

const { execute } = new UsersAuthController();
const { protect } = new IUserAuthValidation();

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: `${process.env.CLIENT_URL}/auth` as string,
<<<<<<< HEAD
		failureRedirect: `${process.env.CLIENT_URL}/loginFailed` as string,
=======
		failureRedirect: "/login/failed",
>>>>>>> e4b43e6e0f7e2a72cfdb829f382e817059ec3a24
	})
);

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			res.status(500).json({
				success: false,
				message: "Failed to logout",
			});
		}
	});
	res.status(200).json({
		success: true,
<<<<<<< HEAD
		message: "Logged out successfully",
=======
		message: "User logged out",
>>>>>>> e4b43e6e0f7e2a72cfdb829f382e817059ec3a24
		message_code: "LOGGED_OUT",
	});
});

router.post("/register", protect, execute);
router.get("/current", protect, execute);
// router.get("/:id", protect, execute);
// router.delete("/:id", protect, execute);

export default router;
