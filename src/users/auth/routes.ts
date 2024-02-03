import { NextFunction, Request, Response, Router } from "express";
import passport = require("passport");
import { catchAsync } from "../../utils/catchAsync";
import ErrorHandler from "../../utils/errors.handler";

const router = Router();

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL + "/signup",
		failureRedirect: "/authentication/failed",
	})
);

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		success: false,
		message: "User failed to authenticate.",
	});
});

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			success: true,
			message: "User has successfully authenticated.",
			user: req.user,
			cookies: req.cookies,
		});
	} else {
		res.status(403).json({
			success: false,
			message: "User is not authenticated.",
		});
	}
});

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/logout",
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		req.logout((err) => {
			if (err) {
				return next(
					new ErrorHandler({
						status_code: 500,
						message: "Error logging out",
						message_code: "LOGOUT_ERROR",
					})
				);
			}
		});
		res.redirect(process.env.CLIENT_URL as string);
	})
);

export default router;
