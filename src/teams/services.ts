import logger, { LogTypes } from "../utils/logger";
import TeamsHelper from "./helper";
import {
	ITeamCreateReqObject,
	ITeamDeleteReqObject,
	ITeamDeleteUserReqObject,
	ITeamJoinReqObject,
	ITeamLeaveReqObject,
	ITeamResObject,
	ITeamUpdateNameReqObject,
} from "./interface";

export default class TeamsServices extends TeamsHelper {
	protected createTeamService = async (
		reqObj: ITeamCreateReqObject
	): Promise<any> => {
		const result = await this.createTeamHelper(reqObj);

		return result;
	};

	protected joinTeamService = async (
		reqObj: ITeamJoinReqObject
	): Promise<any> => {
		const result = await this.joinTeamHelper(reqObj);

		return result;
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
