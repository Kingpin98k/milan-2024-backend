import jwt, { TokenExpiredError } from "jsonwebtoken";
import { errorHandler } from "../../utils/ress.error";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errors.handler";
import logger, { LogTypes } from "../../utils/logger";

export default class IUserAuthValidation {
	public static validatePhoneNumber = (email: string, phone_number: number) => {
		if (!email || !phone_number) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Phone Number is required.",
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
					if (err instanceof TokenExpiredError) {
						reject(
							new ErrorHandler({
								status_code: 401,
								message: "Token expired. Please log in again.",
								message_code: "TOKEN_EXPIRED",
							})
						);
					} else {
						reject(
							new ErrorHandler({
								status_code: 401,
								message: "Invalid token. Please log in again.",
								message_code: "INVALID_TOKEN",
							})
						);
					}
				} else {
					resolve(payload);
				}
			});
		});
	};

	public protect = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let token;
			if (req.cookies) {
				token = req.cookies.token;
			} else {
				throw new ErrorHandler({
					status_code: 400,
					message: "You are not logged in! Please log in to get access.",
					message_code: "NOT_LOGGED_IN",
				});
			}
			const JWT_SECRET = process.env.JWT_SECRET;

			if (!JWT_SECRET)
				throw new ErrorHandler({
					status_code: 400,
					message: "No data in key file",
					message_code: "SOMETHING_WENT_WRONG",
				});

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
