import { v4 } from "uuid";
import TeamsDB from "./db";
import db from "../config/pg.config";
import ErrorHandler from "../utils/errors.handler";
import uniqid from "uniqid";
import {
	ITeamJoinReqObject,
	ITeamMemberAddReqObject,
	ITeamResObject,
	ITeamUpdateNameReqObject,
	IUserTeamForEventReqObject,
} from "./interface";
// import logger, { LogTypes } from "../utils/logger";
import { Client } from "pg";

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
		try {
			// logger("Been here 0", LogTypes.LOGS);

			await this.checkUserAndEventExistance(
				reqObj.user_id,
				reqObj.event_code,
				reqObj.team_name
			);
			// logger("Been here 1", LogTypes.LOGS);

			const result = await db.transaction(async (client: Client) => {
				// logger("Been here 2", LogTypes.LOGS);

				const { user_id, ...teamCreateTestObj } = reqObj;
				const newReqObj = {
					...teamCreateTestObj,
					id: v4(),
					team_code: uniqid(),
					created_at: new Date(),
					updated_at: new Date(),
				};

				// logger(newReqObj, LogTypes.LOGS);

				const team: ITeamResObject = await this.createTeam(newReqObj, client);
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
					event_code: reqObj.event_code,
					team_code: team.team_code,
					created_at: new Date(),
					updated_at: new Date(),
				};

				const teamMember = await this.joinTeam(newReq, true, client);
				if (!teamMember) {
					throw new ErrorHandler({
						status_code: 400,
						message: "Error joining team",
						message_code: "ERROR_JOINING_TEAM",
					});
				}

				// logger("Been here 3", LogTypes.LOGS);
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
		} catch (err) {
			throw err;
		}
	};

	protected getUserTeamForEventHelper = async (
		reqObj: IUserTeamForEventReqObject
	): Promise<any> => {
		const user_data = await this.getUserTeamData(reqObj);

		if (!user_data || user_data.length === 0) {
			return null;
		}

		const members: any = await this.getTeamMembers(reqObj);

		const response = {
			...user_data,
			members: members.members,
		};

		if (!response) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error fetching user teams",
				message_code: "ERROR_FETCHING_USER_TEAMS",
			});
		}

		return response;
	};

	protected joinTeamHelper = async (reqObj: ITeamJoinReqObject) => {
		const user = await this.checkIfExistInEvent(
			reqObj.team_code,
			reqObj.user_id
		);

		if (!user) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Register for the event first",
				message_code: "USER_DOES_NOT_EXIST_IN_EVENT",
			});
		}

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
			event_code: Eteam.event_code,
			team_id: Eteam.team_id,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await db.transaction(async (client: Client) => {
			const updated = await this.increaseUserCount(reqObj.team_code, client);

			if (!updated) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Error joining team",
					message_code: "ERROR_JOINING_TEAM",
				});
			}

			const res = await this.joinTeam(newReqObj, false, client);

			if (!res) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Error joining team",
					message_code: "ERROR_JOINING_TEAM",
				});
			}

			return res;
		});

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

		await db.transaction(async (client: Client) => {
			await this.deleteTeamMembers(reqObj.team_code, client);
			await this.deleteTeam(reqObj.team_code, client);
		});
	};

	protected leaveTeamHelper = async (reqObj: any): Promise<void> => {
		await db.transaction(async (client: Client) => {
			await this.decreaseUserCount(reqObj.team_code, client);
			await this.leaveTeam(reqObj.team_code, reqObj.user_id, client);
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

	protected getAllTeamMembersHelper = async (reqObj: any): Promise<any> => {
		const result = await this.getAllTeamMembers(reqObj.team_id);

		if (!result) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error fetching team members",
				message_code: "ERROR_FETCHING_TEAM_MEMBERS",
			});
		}
		return result;
	};

	protected getAllTeamsOfEventHelper = async (reqObj: any): Promise<any> => {
		const result = await this.getAllTeamsOfEvent(reqObj.event_code);
		if (!result) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error fetching teams of event",
				message_code: "ERROR_FETCHING_TEAMS_OF_EVENT",
			});
		}

		if (result.length === 0) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No teams found for the event",
				message_code: "NO_TEAMS_FOUND_FOR_EVENT",
			});
		}

		return result;
	};
}
