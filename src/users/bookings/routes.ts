import { Router } from "express";
import BookingsController from "./controller";
import BookingAuthValidation from "./middleware";
import JWTUtils from "../../utils/jwt.utils";
const router: Router = Router();

const { protectBooking } = new BookingAuthValidation();
const { execute } = new BookingsController();

// router.use(protect);

router.route("/").get(protectBooking, execute);

router.route("/livecount").get(protectBooking, execute);

router.route("/updateticketissued").patch(execute);

router.route("/resendemail").post(execute);

// router.route("/token").get(async (req, res) => {
// 	const jwtHelper = new JWTUtils();

// 	// const value = await jwtHelper.generateTokens(
// 	// 	"paymenow",
// 	// 	"720h",
// 	// 	process.env.JWT_BOOKING_SECRET!
// 	// );

// 	res.status(200).json({ ok: "hello" });
// });

export default router;
