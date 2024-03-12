import { NextFunction } from "express";
import ErrorHandler from "../../utils/errors.handler";
import { errorHandler } from "../../utils/ress.error";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import logger from "../../utils/logger";

export default class BookingAuthValidation {
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

	public protectBooking = async (req: any, res: any, next: NextFunction) => {
		try {
			let token;
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
			} else {
				throw new ErrorHandler({
					status_code: 401,
					message: "Booking not permitted",
					message_code: "UNAUTHORIZED",
				});
			}

			const decoded: any = await this.jwtVerifyPromisified(
				token,
				process.env.JWT_BOOKING_SECRET!
			);

			if (!decoded) {
				throw new ErrorHandler({
					status_code: 401,
					message: "Booking not permitted",
					message_code: "UNAUTHORIZED",
				});
			}

			if (decoded.data !== "paymenow") {
				throw new ErrorHandler({
					status_code: 401,
					message: "Booking not permitted",
					message_code: "UNAUTHORIZED",
				});
			}

			next();
		} catch (error) {
			errorHandler(res, error);
		}
	};
}
