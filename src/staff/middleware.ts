import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors.handler";
import { errorHandler } from "../utils/ress.error";
import logger, { LogTypes } from "../utils/logger";

export default class IStaffValidation {
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

	protectStaff = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let token;
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
			} else if (req.cookies.token) {
				token = req.cookies.token;
			} else {
				throw new ErrorHandler({
					status_code: 401,
					message: "You are not logged in! Please log in to get access.",
					message_code: "NOT_LOGGED_IN",
				});
			}
			let JWT_SECRET = process.env.JWT_SECRET;
			if (!JWT_SECRET) {
				throw new ErrorHandler({
					status_code: 500,
					message: "No data in key file",
					message_code: "SOMETHING_WENT_WRONG",
				});
			}

			const payload = await this.jwtVerifyPromisified(token, JWT_SECRET);

			if (!payload) {
				throw new ErrorHandler({
					status_code: 401,
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
