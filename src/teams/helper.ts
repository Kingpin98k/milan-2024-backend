import { v4 } from "uuid";
import { EventsServices } from "../events/services";
import UsersAuthService from "../users/auth/services";
import TeamsDB from "./db";
import db from "../config/pg.config";
import ErrorHandler from "../utils/errors.handler";
import {
	ITeamJoinReqObject,
	ITeamMemberAddReqObject,
	ITeamResObject,
	ITeamUpdateNameReqObject,
} from "./interface";
import logger, { LogTypes } from "../utils/logger";

export default class TeamsHelper extends TeamsDB {
	// private eventsService: EventsServices;
	// private usersService: UsersAuthService;

	// constructor({
	// 	eventsService = new EventsServices(),
	// 	usersService = new UsersAuthService(),
	// } = {}) {
	// 	super();
	// 	this.eventsService = eventsService;
	// 	this.usersService = usersService;
	// }

	public createTeamHelper = async (reqObj: any): Promise<any> => {
		logger("Been here 0", LogTypes.LOGS);

		await this.checkUserAndEventExistance(
			reqObj.user_id,
			reqObj.event_code,
			reqObj.team_name
		);

		logger("Been here 1", LogTypes.LOGS);

		const result = await db.transaction(async () => {
			logger("Been here 2", LogTypes.LOGS);

			const { user_id, ...teamCreateTestObj } = reqObj;
			const newReqObj = {
				...teamCreateTestObj,
				id: v4(),
				team_code: v4(),
				created_at: new Date(),
				updated_at: new Date(),
			};

			logger(newReqObj, LogTypes.LOGS);

			const team: ITeamResObject = await this.createTeam(newReqObj);
			if (!team) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Error creating team",
					message_code: "ERROR_CREATING_TEAM",
				});
			}

			const newReq: ITeamMemberAddReqObject = {
				id: v4(),
				user_id: reqObj.user_id,
				is_captain: true,
				team_id: team.id,
				event_id: reqObj.event_id,
				team_code: team.team_code,
				created_at: new Date(),
				updated_at: new Date(),
			};

			const teamMember = await this.joinTeam(newReq, true);
			if (!teamMember) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Error joining team",
					message_code: "ERROR_JOINING_TEAM",
				});
			}

			logger("Been here 3", LogTypes.LOGS);
			return {
				teamDetails: {
					team_code: team.team_code,
					team_name: team.team_name,
					team_id: team.id,
				},
				eventDetails: {
					// eventId: reqObj.event_id,
					event_code: reqObj.event_code,
				},
			};
		});

		if (!result) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error creating team",
				message_code: "ERROR_CREATING_TEAM",
			});
		}

		return result;
	};

	protected joinTeamHelper = async (reqObj: ITeamJoinReqObject) => {
		const Eteam = await this.checkIsExistingTeam(reqObj);

		if (!Eteam) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Team does not exist",
				message_code: "TEAM_DOES_NOT_EXIST",
			});
		}

		const newReqObj = {
			...reqObj,
			id: v4(),
			event_id: Eteam.event_id,
			team_id: Eteam.team_id,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await this.joinTeam(newReqObj);

		if (!result) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error joining team",
				message_code: "ERROR_JOINING_TEAM",
			});
		}

		return result;
	};

	protected updateTeamNameHelper = async (
		reqObj: ITeamUpdateNameReqObject
	): Promise<any> => {
		await this.checkIfCanChangeName(
			reqObj.team_code,
			reqObj.user_id,
			reqObj.team_name
		);

		const result = await this.updateTeamName(
			reqObj.team_code,
			reqObj.team_name
		);

		if (!result) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error updating team name",
				message_code: "ERROR_UPDATING_TEAM_NAME",
			});
		}

		return result;
	};

	protected deleteTeamHelper = async (reqObj: any): Promise<void> => {
		await this.checkIfCaptain(reqObj.team_code, reqObj.user_id);

		await db.transaction(async () => {
			await this.deleteTeamMembers(reqObj.team_code);
			await this.deleteTeam(reqObj.team_code);
		});
	};

	protected leaveTeamHelper = async (reqObj: any): Promise<void> => {
		await db.transaction(async () => {
			await this.leaveTeam(reqObj.team_code, reqObj.user_id);
		});
	};

	protected deleteTeamMemberHelper = async (reqObj: any): Promise<void> => {
		await this.checkIfCaptain(reqObj.team_code, reqObj.captain_id);

		if (reqObj.captain_id === reqObj.member_id) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Team captain cannot leave the team",
				message_code: "TEAM_CAPTAIN_CANNOT_LEAVE",
			});
		}
		await this.deleteTeamMember(reqObj.team_code, reqObj.member_id);
	};

	protected getAllUserTeamsHelper = async (reqObj: any): Promise<any> => {
		const result = await this.getAllUserTeams(reqObj.user_id);

		if (!result) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error fetching user teams",
				message_code: "ERROR_FETCHING_USER_TEAMS",
			});
		}
		return result;
	};
}
