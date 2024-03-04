import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors.handler";
import { errorHandler } from "../utils/ress.error";
import logger, { LogTypes } from "../utils/logger";
// import logger, { LogTypes } from "../utils/logger";

export default class IStaffValidation {
	public static validateEmailAndPhone = (
		email: string,
		phone_number: number
	) => {
		if (!email || !phone_number) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Both Email and PhoneNumber Number is required.",
				message_code: "EMAIL_OR_PHONE_NUMBER_REQUIRED",
			});
		}
		const email_pattern = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;
		const phone_pattern = /^[0-9]{10}$/;

    if (!phone_pattern.test(phone_number.toString())) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Invalid Phone Number format.",
        message_code: "INVALID_PHONE_NUMBER_FORMAT",
      });
    }

		if (!email_pattern.test(email)) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Invalid Email format. Only SRM emails are allowed !",
				message_code: "INVALID_EMAIL_FORMAT",
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

  public protectStaff = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies?.token) {
        token = req.cookies?.token;
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

	public adminAccess = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const user = req.body?.current_user;
			if (!user || user.role !== "admin") {
				throw new ErrorHandler({
					status_code: 403,
					message: "You are not authorized to perform this action",
					message_code: "NOT_AUTHORIZED",
				});
			}
			next();
		} catch (error) {
			errorHandler(res, error);
		}
	};
	public viewerAndAdminAccess = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const user = req.body?.current_user;
			if (!user || (user.role !== "admin" && user.role !== "viewer")) {
				throw new ErrorHandler({
					status_code: 403,
					message: "You are not authorized to perform this action",
					message_code: "NOT_AUTHORIZED",
				});
			}
			next();
		} catch (error) {
			errorHandler(res, error);
		}
	};
}
