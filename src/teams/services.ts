import {
	ITeamCreateReqObject,
	ITeamDeleteReqObject,
	ITeamDeleteUserReqObject,
	ITeamJoinReqObject,
	ITeamLeaveReqObject,
	ITeamResObject,
	ITeamUpdateNameReqObject,
} from "./interface";

export default class TeamsServices {
	protected createTeamService = async (
		reqObj: ITeamCreateReqObject
	): Promise<ITeamResObject> => {
		return {
			id: "123",
			team_name: "team_name",
			event_code: "event_code",
			team_code: "team_code",
			event_id: "event_id",
			created_at: new Date(),
			updated_at: new Date(),
		};
	};

	protected joinTeamService = async (
		reqObj: ITeamJoinReqObject
	): Promise<ITeamResObject> => {
		return {
			id: "123",
			team_name: "team_name",
			event_code: "event_code",
			team_code: "team_code",
			event_id: "event_id",
			created_at: new Date(),
			updated_at: new Date(),
		};
	};

	protected updateTeamNameService = async (
		reqObj: ITeamUpdateNameReqObject
	): Promise<ITeamResObject> => {
		return {
			id: "123",
			team_name: "team_name",
			event_code: "event_code",
			team_code: "team_code",
			event_id: "event_id",
			created_at: new Date(),
			updated_at: new Date(),
		};
	};

	protected deleteTeamService = async (
		reqObj: ITeamDeleteReqObject
	): Promise<void> => {};

	protected leaveTeamService = async (
		reqObj: ITeamLeaveReqObject
	): Promise<void> => {};

	protected deleteUserService = async (
		reqObj: ITeamDeleteUserReqObject
	): Promise<void> => {};
}
