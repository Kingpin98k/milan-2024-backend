import { Request, Response } from "express";
import { errorHandler } from "../utils/ress.error";
import { IResponse } from "../events/interface";
import { TeamRoutes } from "./enums";

export default class TeamsController {
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
			if (method === "POST" && routeName === TeamRoutes.CREATE) {
			} else if (method === "POST" && routeName === TeamRoutes.JOIN) {
			} else if (method === "PATCH" && routeName === TeamRoutes.UPDATE_NAME) {
			} else if (method === "DELETE" && routeName === TeamRoutes.DELETE_TEAM) {
			} else if (method === "POST" && routeName === TeamRoutes.LEAVE) {
			} else if (method === "DELETE" && routeName === TeamRoutes.DELETE_USER) {
			}
			res.status(statusCode).send(response);
		} catch (error) {
			errorHandler(res, error);
		}
	};

	private createTeamController = async (reqObj: any): Promise<IResponse> => {
		return {
			success: false,
			data: {},
			message_code: "UNKNOWN_ERROR",
			message: "Unknown error occurred",
		};
	};

	private joinTeamController = async (reqObj: any): Promise<IResponse> => {
		return {
			success: false,
			data: {},
			message_code: "UNKNOWN_ERROR",
			message: "Unknown error occurred",
		};
	};

	private updateNameController = async (reqObj: any): Promise<IResponse> => {
		return {
			success: false,
			data: {},
			message_code: "UNKNOWN_ERROR",
			message: "Unknown error occurred",
		};
	};

	private deleteTeamController = async (reqObj: any): Promise<IResponse> => {
		return {
			success: false,
			data: {},
			message_code: "UNKNOWN_ERROR",
			message: "Unknown error occurred",
		};
	};

	private leaveController = async (reqObj: any): Promise<IResponse> => {
		return {
			success: false,
			data: {},
			message_code: "UNKNOWN_ERROR",
			message: "Unknown error occurred",
		};
	};

	private deleteUserController = async (reqObj: any): Promise<IResponse> => {
		return {
			success: false,
			data: {},
			message_code: "UNKNOWN_ERROR",
			message: "Unknown error occurred",
		};
	};
}
