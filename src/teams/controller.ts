import { Request, Response } from "express";
import { errorHandler } from "../utils/ress.error";
import { IResponse } from "../events/interface";
import { TeamRoutes } from "./enums";
import TeamsServices from "./services";
import logger, { LogTypes } from "../utils/logger";
import { ITeamDeleteReqObject, IUserTeamForEventReqObject } from "./interface";

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
				logger(user_id, LogTypes.LOGS);
				const reqObj = { user_id };
				response = await this.getAllUserTeamsController(reqObj);
			} else if (
				method === "GET" &&
				routeName === TeamRoutes.GET_USER_TEAM_FOR_EVENT
			) {
				const reqObj = {
					event_code: req.params.eventCode,
					user_id: req.body.current_user.id,
				};
				response = await this.getUserTeamForEventController(reqObj);
			} else if (method === "POST" && routeName === TeamRoutes.CREATE) {
				response = await this.createTeamController({
					team_name: req.body.team_name,
					event_code: req.body.event_code,
					user_id: req.body.current_user.id,
				});
			} else if (method === "POST" && routeName === TeamRoutes.JOIN) {
				const reqObj = {
					team_code: req.body.team_code,
					user_id: req.body.current_user.id,
				};
				response = await this.joinTeamController(reqObj);
			} else if (method === "PATCH" && routeName === TeamRoutes.UPDATE_NAME) {
				const reqObj = {
					teqam_code: req.body.team_code,
					user_id: req.body.current_user.id,
				};
				response = await this.updateNameController(reqObj);
			} else if (method === "DELETE" && routeName === TeamRoutes.DELETE_TEAM) {
				const team_code = req.params.teamCode;
				const user_id = req.body.current_user.id;
				const reqObj: ITeamDeleteReqObject = { team_code, user_id };
				response = await this.deleteTeamController(reqObj);
			} else if (method === "POST" && routeName === TeamRoutes.LEAVE) {
				const reqObj = { ...req.body, user_id: req.body.current_user.id };
				response = await this.leaveController(reqObj);
			} else if (method === "POST" && routeName === TeamRoutes.DELETE_MEMBER) {
				const reqObj = { ...req.body, captain_id: req.body.current_user.id };
				response = await this.deleteTeamMemberController(reqObj);
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

	private getUserTeamForEventController = async (
		reqObj: IUserTeamForEventReqObject
	): Promise<IResponse> => {
		const res = await this.getUserTeamForEventHelper(reqObj);
		return {
			success: true,
			data: res,
			message_code: "USER_TEAMS_FETCHED",
			message: "User teams fetched successfully",
		};
	};
}
