import { Request, Response } from "express";
import { v4 } from "uuid";
import { errorHandler } from "../utils/ress.error";
import { StaffRoutes } from "./enums";
import StaffService from "./services";
import {
	IStaffAuthResObject,
	IStaffLoginRequestObject,
	IStaffPasswordChangeRequestObject,
	IStaffRegisterObject,
	StaffScope,
} from "./interface";
import { IResponse } from "../events/interface";

export default class StaffController extends StaffService {
	public execute = async (req: Request, res: Response): Promise<void> => {
		try {
			const method = req.method;
			const routeName = req.route.path.split("/")[1];
			// console.log("routeName", routeName);
			// console.log(req.body);
			let response: IResponse = {
				success: false,
				data: {},
				message_code: "UNKNOWN_ERROR",
				message: "Unknown error occurred",
			};
			let statusCode = 200;
			if (method === "GET" && routeName === StaffRoutes.GET_STAFFS) {
				const queryParams = JSON.parse(JSON.stringify(req.query));
				const type = queryParams.type as StaffScope;
				response = await this.getStaffsController(type);
			} else if (
				method === "GET" &&
				routeName === StaffRoutes.GET_CURRENT_STAFF
			) {
				const id = req.body.current_user.id;
				response = await this.getStaffByIdController(id);
			} else if (
				method === "POST" &&
				routeName === StaffRoutes.FORGOT_PASSWORD
			) {
				const reqObj: IStaffPasswordChangeRequestObject = req.body;
				response = await this.changePasswordController(reqObj);
			} else if (method === "POST" && routeName === StaffRoutes.REGISTER) {
				const reqObj = { ...req.body, id: v4() };
				response = await this.registerController(reqObj);
				res.cookie("token", response.data.token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
				});
			} else if (method === "POST" && routeName === StaffRoutes.LOGIN) {
				const reqObj = req.body;
				response = await this.loginController(reqObj);
				res.cookie("token", response.data.token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
				});
			} else if (method === "POST" && routeName === StaffRoutes.VERIFY) {
				const { user_id } = req.body;
				response = await this.verifyController(user_id);
			} else if (method === "POST" && routeName === StaffRoutes.DENY) {
				const id = req.body.user_id;
				response = await this.denyController(id);
			} else if (method === "DELETE") {
				const id = req.params.staffId;
				statusCode = 200;
				response = await this.deleteController(id);
			} else if (method === "GET" && routeName === StaffRoutes.LOGOUT) {
				res.cookie("token", "", {
					expires: new Date(Date.now()),
					httpOnly: true,
					secure: true,
					sameSite: "none",
				});
				response = {
					success: true,
					data: {},
					message_code: "LOGOUT_SUCCESS",
					message: "User logged out successfully",
				};
			}
			res.status(statusCode).send(response);
		} catch (error) {
			errorHandler(res, error);
		}
	};
	private getStaffsController = async (
		type: StaffScope
	): Promise<IResponse> => {
		const staffs = await this.getStaffsService(type);
		return {
			success: true,
			data: staffs,
			message_code: "GET_STAFFS_SUCCESS",
			message: "Staffs fetched successfully",
		};
	};
	private registerController = async (
		reqObj: IStaffRegisterObject
	): Promise<IResponse> => {
		const data: IStaffAuthResObject = await this.registerService(reqObj);
		return {
			success: true,
			data: data,
			message_code: "REGISTER_SUCCESS",
			message: "User registered successfully",
		};
	};
	private loginController = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IResponse> => {
		const data = await this.loginService(reqObj);
		return {
			success: true,
			data: data,
			message_code: "LOGIN_SUCCESS",
			message: "User logged in successfully",
		};
	};
	private verifyController = async (id: string): Promise<IResponse> => {
		const user = await this.verifyService(id);
		return {
			success: true,
			data: user,
			message_code: "VERIFY_SUCCESS",
			message: "User verified successfully",
		};
	};
	private denyController = async (id: string): Promise<IResponse> => {
		const user = await this.denyService(id);
		return {
			success: true,
			data: user,
			message_code: "DENY_SUCCESS",
			message: "User denied successfully",
		};
	};
	private deleteController = async (id: string): Promise<IResponse> => {
		await this.deleteService(id);
		return {
			success: true,
			message_code: "DELETE_SUCCESS",
			message: "User deleted successfully",
			data: {},
		};
	};

	private changePasswordController = async (
		reqObj: IStaffPasswordChangeRequestObject
	): Promise<IResponse> => {
		const user = await this.changePasswordService(reqObj);
		return {
			success: true,
			data: user,
			message_code: "CHANGE_PASSWORD_SUCCESS",
			message: "Password changed successfully",
		};
	};

	private getStaffByIdController = async (id: string): Promise<IResponse> => {
		const user = await this.getStaffService(id);
		return {
			success: true,
			data: user,
			message_code: "GET_STAFF_SUCCESS",
			message: "Staff fetched successfully",
		};
	};
}
