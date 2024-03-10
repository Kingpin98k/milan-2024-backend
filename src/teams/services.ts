import logger, { LogTypes } from "../utils/logger";
import TeamsHelper from "./helper";
import {
	ITeamCreateReqObject,
	ITeamDeleteMemberReqObject,
	ITeamDeleteReqObject,
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
		const result = await this.updateTeamNameHelper(reqObj);

		return result;
	};

	protected deleteTeamService = async (
		reqObj: ITeamDeleteReqObject
	): Promise<void> => {
		await this.deleteTeamHelper(reqObj);
	};

	protected leaveTeamService = async (
		reqObj: ITeamLeaveReqObject
	): Promise<void> => {
		await this.leaveTeamHelper(reqObj);
	};

	protected deleteTeamMemberService = async (
		reqObj: ITeamDeleteMemberReqObject
	): Promise<void> => {
		await this.deleteTeamMemberHelper(reqObj);
	};

	protected getAllUserTeamsService = async (reqObj: any): Promise<any> => {
		const result = await this.getAllUserTeamsHelper(reqObj);

		return result;
	};

	protected getUserTeamForEventService = async (reqObj: any): Promise<any> => {
		const result = await this.getUserTeamForEventHelper(reqObj);

		return result;
	};

	protected getAllTeamMembersService = async (reqObj: any): Promise<any> => {
		const result = await this.getAllTeamMembersHelper(reqObj);

		return result;
	};

	protected getAllTeamsOfEventService = async (reqObj: any): Promise<any> => {
		const result = await this.getAllTeamsOfEventHelper(reqObj);

		return result;
	}
}
