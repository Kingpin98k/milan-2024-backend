import { Request, Response } from "express";
import { errorHandler } from "../../utils/ress.error";
import { IResponse } from "./interface";
import { RequestMethods } from "../../utils/enums";
import { UsersAuthRoutes } from "./enums";
import IUserAuthValidation from "./middleware";
import { v4 } from "uuid";
import {
	AuthObj,
	IAuthResponse,
	IUserAuthLoginReqObj,
	IUserAuthResObject,
	IUserAuthSignupReqObj,
} from "./interface";
import UsersAuthService from "./services";
import logger, { LogTypes } from "../../utils/logger";
import { LOCK } from "sequelize";

export default class UsersAuthController extends UsersAuthService {
	public execute = async (req: Request, res: Response): Promise<void> => {
		try {
			const method = req.method;
			const routeName = req.route.path.split("/")[1];

			let response: IResponse = {
				success: false,
			};
			let statusCode = 200;

			if (routeName === UsersAuthRoutes.LOGIN) {
				if (method === RequestMethods.POST) {
					logger(req.body, LogTypes.LOGS);
					const email = req.body?.email;
					const authRes: IAuthResponse = await this.loginController(email);
					res.cookie("token", authRes.token, {
						expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
						httpOnly: true,
						secure: true,
						sameSite: "none",
					});
					response = authRes.user;
				}
			} else if (routeName === UsersAuthRoutes.LOGOUT) {
				if (method === RequestMethods.GET) {
					res.cookie("token", "", {
						expires: new Date(Date.now()),
						httpOnly: true,
						secure: true,
						sameSite: "none",
					});
					response.success = true;
					response.message_code = "LOGGED_OUT";
					response.message = "Logged Out Successfully";
				}
			} else if (
				method === RequestMethods.GET &&
				routeName === UsersAuthRoutes.GET_USER_BY_ID
			) {
				const user_id = req.params.userId;
				response = await this.getUserController(user_id);
			} else if (routeName === UsersAuthRoutes.SIGNUP) {
				if (method === RequestMethods.POST) {
					const reqObj: IUserAuthSignupReqObj = { ...req.body, id: v4() };
					const authRes: IAuthResponse = await this.signupController(reqObj);
					res.cookie("token", authRes.token, {
						expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
						httpOnly: true,
						secure: true,
						sameSite: "none",
					});
					response = authRes.user;
				}
			} else if (method === RequestMethods.DELETE) {
				const user_id = req.params.id;
				await this.deleteUserController(user_id);
				response.message = "User deleted successfully";
				res.cookie("token", "", {
					expires: new Date(Date.now()),
					httpOnly: true,
					secure: true,
					sameSite: "none",
				});
			} else if (method === RequestMethods.GET) {
				if (routeName === UsersAuthRoutes.CURRENT) {
					const user_id = req.body.current_user.id;
					response = await this.getUserController(user_id);
				} else {
					const user_id = req.params.id;
					response = await this.getUserController(user_id);
				}
			}
			res.status(statusCode).send(response);
		} catch (error) {
			errorHandler(res, error);
		}
	};

	private loginController = async (email: string): Promise<IAuthResponse> => {
		const data: AuthObj = await this.loginService(email);

		return {
			user: {
				success: true,
				message: "Logged In Successfully!",
				message_code: "LOGIN_SUCCESS",
				data: data,
			},
			token: data.token,
		};
	};

	private signupController = async (
		reqObj: IUserAuthSignupReqObj
	): Promise<IAuthResponse> => {
		IUserAuthValidation.validatePhoneNumber(reqObj.email, reqObj.phone_number);
		const data: AuthObj = await this.signupService(reqObj);
		return {
			user: {
				success: true,
				message: "Signed Up Successfully!",
				message_code: "REGISTER_SUCCESS",
				data: data,
			},
			token: data.token,
		};
	};

	private deleteUserController = async (user_id: string): Promise<void> => {
		await this.deleteUserService(user_id);
		return;
	};

	private getUserController = async (user_id: string): Promise<any> => {
		const user = await this.getUserService(user_id);
		return {
			success: true,
			message: "User fetched successfully",
			message_code: "FETCH_USER_SUCCESS",
			data: user,
		};
	};
}
