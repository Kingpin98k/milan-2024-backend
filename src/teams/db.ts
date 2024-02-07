import {
	ITeamCreateReqObject,
	ITeamJoinReqObject,
	ITeamMemberAddReqObject,
	ITeamUpdateNameReqObject,
} from "./interface";
import db from "../config/pg.config";

export default class TeamsDB {
	protected createTeam = async (reqObj: ITeamCreateReqObject) => {
		const query = db.format("INSERT INTO teams ? RETURNING *", reqObj);
		const result = await db.query(query);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected joinTeam = async (
		reqObj: ITeamMemberAddReqObject,
		is_captain: boolean = false
	) => {
		reqObj.is_captain = is_captain;
		const query = db.format("INSERT INTO team_members ? RETURNING *", reqObj);
		const result = await db.query(query);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected checkIsExistingTeam = async (team_code: string) => {
		const query = `SELECT * FROM teams WHERE team_code = $1 LIMIT 1`;
		const result = await db.query(query, [team_code]);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected checkIsExistingTeamMember = async (
		team_id: string,
		user_id: string
	) => {
		const query = `SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2 LIMIT 1`;
		const result = await db.query(query, [team_id, user_id]);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected changeTeamName = async (reqObj: ITeamUpdateNameReqObject) => {
		const query = `UPDATE teams SET team_name = $1 WHERE team_code = $2 RETURNING *`;
		const result = await db.query(query, [reqObj.team_name, reqObj.team_code]);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected deleteTeam = async (team_code: string) => {
		const query = `DELETE FROM teams WHERE team_code = $1`;
		const result = await db.query(query, [team_code]);
		if (result instanceof Error) throw result;
	};

	protectedDeleteTeamMembers = async (team_code: string) => {
		const query = `DELETE FROM team_members WHERE team_code = $1`;
		const result = await db.query(query, [team_code]);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected leaveTeam = async (team_code: string, user_id: string) => {
		const query = `DELETE FROM team_members WHERE team_code = $1 AND user_id = $2`;
		const result = await db.query(query, [team_code, user_id]);
		if (result instanceof Error) throw result;
	};
}
