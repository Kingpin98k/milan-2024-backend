import jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/ress.error";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errors.handler";

export default class IUserAuthValidation {
	public static validatePhoneNumber = (phone_number: number) => {
		if (!phone_number) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Phone Number is required.",
				message_code: "EMAIL_OR_PHONE_NUMBER_REQUIRED",
			});
		}
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
			if (!req.user) {
				throw new ErrorHandler({
					status_code: 401,
					message: "Unauthorized",
					message_code: "GOOGLE_LOGIN_REQUIRED",
				});
			}
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
