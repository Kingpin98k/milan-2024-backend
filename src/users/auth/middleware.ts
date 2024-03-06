import jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/ress.error";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errors.handler";

export default class IUserAuthValidation {
	public static validatePhoneNumber = (email: string, phone_number: number) => {
		if (!email || !phone_number) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Phone Number is required.",
				// message: "Email or Phone Number is required.",
				message_code: "EMAIL_OR_PHONE_NUMBER_REQUIRED",
			});
		}

		// const email_pattern = /^[a-zA-Z0-9]+@srmist.edu.in$/;

		// if (!email_pattern.test(email)) {
		// 	throw new ErrorHandler({
		// 		status_code: 400,
		// 		message: "Invalid KTR Student email format.",
		// 		message_code: "INVALID_KTR_STUDENT_EMAIL_FORMAT",
		// 	});
		// }

		const phone_pattern = /^[0-9]{10}$/;

		if (!phone_pattern.test(phone_number.toString())) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Invalid Phone Number format.",
				message_code: "INVALID_PHONE_NUMBER_FORMAT",
			});
		}
	};

	private jwtVerifyPromisified = (token: string, secret: string) => {
		return new Promise((resolve, reject) => {
			jwt.verify(token, secret, {}, (err, payload) => {
				if (err) {
					reject(err);
				} else {
					resolve(payload);
				}
			});
		});
	};

	public protect = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let token;
			// 1. Getting the token & Checking if it is there with the header??
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
			} else if (req.cookies.token) {
				// To check for the jwt in cookie
				token = req.cookies.token;
			} else {
				throw new ErrorHandler({
					status_code: 400,
					message: "You are not logged in! Please log in to get access.",
					message_code: "NOT_LOGGED_IN",
				});
			}

			let JWT_SECRET = process.env.JWT_SECRET;

			// fs.readFile(
			// 	path.resolve(__dirname, "../../../keys/jwtRS256.key"),
			// 	"utf-8",
			// 	(err, data) => {
			// 		if (err) {
			// 			throw new ErrorHandler({
			// 				status_code: 400,
			// 				message: "Something went wrong while generating cookie",
			// 				message_code: "SOMETHING_WENT_WRONG",
			// 			});
			// 		} else {
			// 			JWT_SECRET = data;
			// 		}
			// 	}
			// );

			if (!JWT_SECRET)
				throw new ErrorHandler({
					status_code: 400,
					message: "No data in key file",
					message_code: "SOMETHING_WENT_WRONG",
				});

			// 2. Verification of Token
			const payload = await this.jwtVerifyPromisified(token, JWT_SECRET);

			if (!payload) {
				throw new ErrorHandler({
					status_code: 400,
					message: "You are not logged in! Please log in to get access.",
					message_code: "NOT_LOGGED_IN",
				});
			}

			const jsonPayload = JSON.parse(JSON.stringify(payload));

			req.body.current_user = jsonPayload.data;

			next();
		} catch (error) {
			errorHandler(res, error);
		}
	};
}

// 1.soft delete
// 2.is ktr-student
// 3.regex
// 4.Error Discord
// 5.gender
