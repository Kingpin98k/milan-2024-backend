import { Request, Response } from "express";
import { IResponse } from "./interface";
import { errorHandler } from "../../utils/ress.error";
import { RequestMethods } from "../../utils/enums";
import { UsersAuthRoutes } from "./enums";
import IUserAuthValidation from "./middleware";
import { v4 } from "uuid";
import {
	AuthObj,
	IUserAuthLoginReqObj,
	IUserAuthResObject,
	IUserAuthSignupReqObj,
} from "./interface";
import UsersAuthService from "./services";

export default class UsersAuthController extends UsersAuthService {
	public execute = async (req: Request, res: Response): Promise<void> => {
		try {
			const method = req.method;
			const routeName = req.route.path.split("/")[1];

			let response: IResponse = {
				success: false,
			};
			let statusCode = 200;
			if (routeName === UsersAuthRoutes.REGISTER) {
				if (method === RequestMethods.POST) {
					const reqObj: IUserAuthSignupReqObj = { ...req.body, id: v4() };
					const authRes: IResponse = await this.signupController(reqObj);
					response = authRes;
				}
			} else if (method === RequestMethods.GET) {
				if (routeName === UsersAuthRoutes.CURRENT) {
					const this_user = req.user as any;
					const { email } = this_user;
					response = await this.getUserController(email);
				}
			}
			res.status(statusCode).send(response);
		} catch (error) {
			errorHandler(res, error);
		}
	};

	private signupController = async (
		reqObj: IUserAuthSignupReqObj
	): Promise<IResponse> => {
		IUserAuthValidation.validatePhoneNumber(reqObj.phone_number);

		const data: AuthObj = await this.signupService(reqObj);
		return {
			success: true,
			message: "user registered successfully !",
			data: data,
		};
	};

	// private deleteUserController = async (user_id: string): Promise<void> => {
	// 	await this.deleteUserService(user_id);
	// 	return;
	// };

	private getUserController = async (email: string): Promise<IResponse> => {
		const user: IUserAuthResObject = await this.getUserService(email);
		return {
			success: true,
			message: "User fetched successfully",
			data: {
				user: user,
			},
		};
	};
}
