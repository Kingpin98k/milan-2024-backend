import { Router, response } from "express";
import UsersAuthController from "./controller";
import IUserAuthValidation from "./middleware";
import passport from "passport";

const router: Router = Router();

const { execute } = new UsersAuthController();
const { protect } = new IUserAuthValidation();

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: `${process.env.CLIENT_URL}` as string,
		failureRedirect: `${process.env.CLIENT_URL}/loginFailed` as string,
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
	res.redirect(process.env.CLIENT_URL as string);
});

router.post("/register", protect, execute);
router.get("/current", protect, execute);
// router.get("/:id", protect, execute);
// router.delete("/:id", protect, execute);

export default router;
