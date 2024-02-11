import { Request, Response } from "express";
import { errorHandler } from "../utils/ress.error";
import { IResponse } from "../events/interface";
import { TeamRoutes } from "./enums";
import TeamsServices from "./services";
import logger, { LogTypes } from "../utils/logger";
import { ITeamDeleteReqObject } from "./interface";

export default class TeamsController extends TeamsServices {
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
			if (method === "GET" && routeName === TeamRoutes.GET_TEAMS) {
				const user_id = req.params.userId;
				const reqObj = { user_id };
				response = await this.getAllUserTeamsController(reqObj);
			} else if (method === "POST" && routeName === TeamRoutes.CREATE) {
				response = await this.createTeamController(req.body);
			} else if (method === "POST" && routeName === TeamRoutes.JOIN) {
				response = await this.joinTeamController(req.body);
			} else if (method === "PATCH" && routeName === TeamRoutes.UPDATE_NAME) {
				response = await this.updateNameController(req.body);
			} else if (method === "DELETE" && routeName === TeamRoutes.DELETE_TEAM) {
				const team_code = req.params.teamCode;
				const user_id = req.body.user_id;
				const reqObj: ITeamDeleteReqObject = { team_code, user_id };
				response = await this.deleteTeamController(reqObj);
				statusCode = 204;
			} else if (method === "POST" && routeName === TeamRoutes.LEAVE) {
				response = await this.leaveController(req.body);
			} else if (method === "POST" && routeName === TeamRoutes.DELETE_MEMBER) {
				response = await this.deleteTeamMemberController(req.body);
			}
			res.status(statusCode).send(response);
		} catch (error) {
			errorHandler(res, error);
		}
	};

	private createTeamController = async (reqObj: any): Promise<IResponse> => {
		const res = await this.createTeamService(reqObj);

		logger(res, LogTypes.LOGS);

		return {
			success: true,
			data: res,
			message_code: "TEAM_CREATED",
			message: "Team created successfully",
		};
	};

	private joinTeamController = async (reqObj: any): Promise<IResponse> => {
		const res = await this.joinTeamService(reqObj);

		return {
			success: true,
			data: res,
			message_code: "TEAM_JOINED",
			message: "Team joined successfully",
		};
	};

	private updateNameController = async (reqObj: any): Promise<IResponse> => {
		const res = await this.updateTeamNameService(reqObj);

		return {
			success: true,
			data: res,
			message_code: "TEAM_NAME_UPDATED",
			message: "Team name updated successfully",
		};
	};

	private deleteTeamController = async (reqObj: any): Promise<IResponse> => {
		await this.deleteTeamService(reqObj);
		return {
			success: true,
			data: {},
			message_code: "TEAM_DELETED",
			message: "Team deleted successfully",
		};
	};

	private leaveController = async (reqObj: any): Promise<IResponse> => {
		await this.leaveTeamService(reqObj);
		return {
			success: true,
			data: {},
			message_code: "TEAM_LEFT",
			message: "Team left successfully",
		};
	};

	private deleteTeamMemberController = async (
		reqObj: any
	): Promise<IResponse> => {
		await this.deleteTeamMemberService(reqObj);
		return {
			success: true,
			data: {},
			message_code: "TEAM_MEMBER_DELETED",
			message: "Team member deleted successfully",
		};
	};

	private getAllUserTeamsController = async (
		reqObj: any
	): Promise<IResponse> => {
		const res = await this.getAllUserTeamsService(reqObj);

		return {
			success: true,
			data: res,
			message_code: "USER_TEAMS_FETCHED",
			message: "User teams fetched successfully",
		};
	};
}
