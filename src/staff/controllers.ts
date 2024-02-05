import { Request, Response } from "express";
import { v4 } from "uuid";
import { errorHandler } from "../utils/ress.error";
import { StaffRoutes } from "./enums";
import StaffService from "./services";
import {
	IStaffLoginRequestObject,
	IStaffRegisterObject,
	StaffScope,
} from "./interface";
import logger, { LogTypes } from "../utils/logger";
import { IResponse } from "../events/interface";

export default class StaffController extends StaffService {
	public execute = async (req: Request, res: Response): Promise<void> => {
		try {
			const method = req.method;
			const routeName = req.route.path.split("/")[1];

			let response: IResponse = {
				success: false,
				data: {},
				message_code: "UNKNOWN_ERROR",
				message: "Unknown error occurred",
			};
			let statusCode = 200;
			if (method === "GET") {
				const queryParams = JSON.parse(JSON.stringify(req.query));
				const type = queryParams.type as StaffScope;
				response = await this.getStaffsController(type);
			} else if (method === "POST" && routeName === StaffRoutes.REGISTER) {
				const reqObj = { ...req.body, id: v4() };
				response = await this.registerController(reqObj);
			} else if (method === "POST" && routeName === StaffRoutes.LOGIN) {
				const reqObj: IStaffLoginRequestObject = req.body;
				response = await this.loginController(reqObj);
			} else if (method === "POST" && routeName === StaffRoutes.VERIFY) {
				const { email } = req.body;
				response = await this.verifyController(email);
			} else if (method === "POST" && routeName === StaffRoutes.DENY) {
				const email = req.body.email;
				response = await this.denyController(email);
			} else if (method === "DELETE") {
				const id = req.params.staffId;
				statusCode = 204;
				response = await this.deleteController(id);
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
		const user = await this.registerService(reqObj);
		return {
			success: true,
			data: user,
			message_code: "REGISTER_SUCCESS",
			message: "User registered successfully",
		};
	};
	private loginController = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IResponse> => {
		const user = await this.loginService(reqObj);
		return {
			success: true,
			data: user,
			message_code: "LOGIN_SUCCESS",
			message: "User logged in successfully",
		};
	};
	private verifyController = async (email: string): Promise<IResponse> => {
		const user = await this.verifyService(email);
		return {
			success: true,
			data: user,
			message_code: "VERIFY_SUCCESS",
			message: "User verified successfully",
		};
	};
	private denyController = async (email: string): Promise<IResponse> => {
		const user = await this.denyService(email);
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
}
