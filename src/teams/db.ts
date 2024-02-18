import {
	ITeamCreateReqObject,
	ITeamMemberAddReqObject,
	ITeamResObject,
	ITeamUpdateNameReqObject,
} from "./interface";
import db from "../config/pg.config";
import ErrorHandler from "../utils/errors.handler";
import { Client } from "pg";

export default class TeamsDB {
	protected createTeam = async (
		reqObj: ITeamCreateReqObject,
		client?: Client
	): Promise<ITeamResObject> => {
		const query = db.format("INSERT INTO teams ? RETURNING *", reqObj);
		let result;
		if (client) {
			result = await client.query(query);
		} else {
			result = await db.query(query);
		}
		if (result instanceof Error) throw result;
		return result.rows[0] as unknown as ITeamResObject;
	};

	protected joinTeam = async (
		reqObj: any,
		is_captain: boolean = false,
		client?: Client
	) => {
		reqObj.is_captain = is_captain;
		const query = db.format("INSERT INTO team_members ? RETURNING *", reqObj);
		let result;
		if (client) {
			result = await client.query(query);
		} else {
			result = await db.query(query);
		}
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected checkIsExistingTeam = async (reqObj: any): Promise<any> => {
		const query = `SELECT * FROM CheckTeamAndUser($1, $2);`;
		const result = await db.query(query, [reqObj.team_code, reqObj.user_id]);
		if (result instanceof Error) {
			if (result.message === "TEAM_NOT_FOUND") {
				throw new ErrorHandler({
					message: "Team not found",
					status_code: 400,
					message_code: "TEAM_NOT_FOUND",
				});
			} else if (result.message === "ALREADY_IN_TEAM") {
				throw new ErrorHandler({
					message: "User already in team",
					status_code: 400,
					message_code: "USER_ALREADY_IN_TEAM",
				});
			} else {
				throw result;
			}
		}
		return result.rows[0] as any;
	};

	protected checkIsExistingTeamMember = async (
		team_id: string,
		user_id: string
	) => {
		const query = `SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2 LIMIT 1`;
		const result = await db.query(query, [team_id, user_id]);
		if (result instanceof Error) throw result;
		return result.rows[0] as any;
	};

	protected deleteTeam = async (team_code: string) => {
		const query = `DELETE FROM teams WHERE team_code = $1`;
		const result = await db.query(query, [team_code]);
		if (result instanceof Error) throw result;
	};

	protected deleteTeamMembers = async (team_code: string) => {
		const query = `DELETE FROM team_members WHERE team_code = $1`;
		const result = await db.query(query, [team_code]);
		if (result instanceof Error) throw result;
	};

	protected leaveTeam = async (team_code: string, user_id: string) => {
		const query = `
		DO $$
		BEGIN
				IF NOT EXISTS (
						SELECT 1 FROM teams WHERE team_code = '${team_code}'
				) THEN
						RAISE EXCEPTION 'TEAM_DOES_NOT_EXIST';
				END IF;
		
				IF EXISTS (
						SELECT 1 FROM team_members WHERE team_code = '${team_code}' AND user_id = '${user_id}' AND is_captain = TRUE
				) THEN
						RAISE EXCEPTION 'CAPTAIN_CANT_LEAVE_TEAM';
				END IF;
		
				DELETE FROM team_members WHERE team_code = '${team_code}' AND user_id = '${user_id}';
		END $$;
		
		`;
		const result = await db.query(query);
		if (result instanceof Error) {
			if (result.message === "TEAM_DOES_NOT_EXIST") {
				throw new ErrorHandler({
					message: "Team does not exist",
					status_code: 400,
					message_code: "TEAM_DOES_NOT_EXIST",
				});
			} else if (result.message === "CAPTAIN_CANT_LEAVE_TEAM") {
				throw new ErrorHandler({
					message: "Team captain cannot leave the team",
					status_code: 400,
					message_code: "CAPTAIN_CANT_LEAVE_TEAM",
				});
			} else {
				throw result;
			}
		}
	};

	protected checkUserAndEventExistance = async (
		user_id: string,
		event_id: string,
		team_name: string
	) => {
		// const insertFn = `
		// 	CREATE OR REPLACE FUNCTION CheckUserAndEventExistence(
		// 		userId UUID,
		// 		eventCode TEXT
		// 			teamName TEXT
		// ) RETURNS VOID AS $$
		// BEGIN
		// 		-- Check if the user is associated with the event
		// 		IF NOT EXISTS (
		// 				SELECT 1 FROM event_users
		// 				WHERE user_id = userId AND event_code = eventCode
		// 		) THEN
		// 				RAISE EXCEPTION 'NOT_ASSOCIATED_WITH_EVENT';
		// 		END IF;

		// 		-- Check if the event is a group event
		// 		IF NOT EXISTS (
		// 				SELECT 1 FROM events
		// 				WHERE event_code = eventCode AND is_group_event = TRUE
		// 		) THEN
		// 				RAISE EXCEPTION 'NOT_GROUP_EVENT';
		// 		END IF;

		// 		DECLARE
		// 				issrmktrStudent BOOLEAN;
		// 				eventScopeValue TEXT;
		// 		BEGIN
		// 				SELECT is_srm_ktr INTO issrmktrStudent FROM users WHERE id = userId;
		// 				SELECT event_scope INTO eventScopeValue FROM events WHERE event_code = eventCode;

		// 				-- Check if the event scope is 'non_ktr' and the user is a KTR student
		// 				IF eventScopeValue = 'nonsrm' AND issrmktrStudent THEN
		// 						RAISE EXCEPTION 'EVENT_NOT_FOR_KTR_STUDENTS';
		// 				END IF;

		// 			IF EXISTS (
		// 				SELECT 1 FROM teams WHERE event_code = eventCode AND team_name = teamName
		// 			)
		// 			THEN
		// 				RAISE EXCEPTION 'SELECT_ANOTHER_NAME';
		// 			END IF;
		// END;
		// 		-- If all checks pass, return
		// 		RETURN;

		// END;
		// $$ LANGUAGE plpgsql;
		// 	`;
		const query = `SELECT CheckUserAndEventExistence($1, $2, $3)`;

		const res = await db.query(query, [user_id, event_id, team_name]);

		if (res instanceof Error) {
			if (res.message === "NOT_ASSOCIATED_WITH_EVENT") {
				throw new ErrorHandler({
					message: "User not associated with event",
					status_code: 400,
					message_code: "USER_NOT_ASSOCIATED_WITH_EVENT",
				});
			} else if (res.message === "NOT_GROUP_EVENT") {
				throw new ErrorHandler({
					message: "Event is not a group event",
					status_code: 400,
					message_code: "EVENT_NOT_GROUP_EVENT",
				});
			} else if (res.message === "NOT_SRM_STUDENT") {
				throw new ErrorHandler({
					message: "User is not an SRM student",
					status_code: 400,
					message_code: "USER_NOT_SRM_STUDENT",
				});
			} else if (res.message === "SELECT_ANOTHER_NAME") {
				throw new ErrorHandler({
					message: "Team name already exists",
					status_code: 400,
					message_code: "TEAM_NAME_EXISTS",
				});
			} else {
				throw res;
			}
		}
	};

	protected updateTeamName = async (team_code: string, team_name: string) => {
		const query = `UPDATE teams SET team_name = $1 WHERE team_code = $2 RETURNING *`;
		const result = await db.query(query, [team_name, team_code]);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected checkIfCaptain = async (team_code: string, user_id: string) => {
		const query = `		DO $$
		BEGIN
			IF NOT EXISTS (
					SELECT 1 FROM teams WHERE team_code = '${team_code}'
			) THEN
					RAISE EXCEPTION 'TEAM_DOES_NOT_EXIST';
			END IF;
			IF NOT EXISTS (
					SELECT 1 FROM team_members WHERE team_code = '${team_code}' AND user_id = '${user_id}' AND is_captain = TRUE
			) THEN
					RAISE EXCEPTION 'USER_IS_NOT_CAPTAIN';
			END IF;
		END $$;`;

		const result = await db.query(query);

		if (result instanceof Error) {
			if (result.message === "TEAM_DOES_NOT_EXIST") {
				throw new ErrorHandler({
					message: "Team does not exist",
					status_code: 400,
					message_code: "TEAM_DOES_NOT_EXIST",
				});
			} else if (result.message === "USER_IS_NOT_CAPTAIN") {
				throw new ErrorHandler({
					message: "Only Team Cpatains have this permission !",
					status_code: 400,
					message_code: "USER_IS_NOT_CAPTAIN",
				});
			} else {
				throw result;
			}
		}
	};

	protected checkIfCanChangeName = async (
		team_code: string,
		user_id: string,
		team_name: string
	): Promise<void> => {
		const query = `        
		DO $$
		BEGIN
			IF NOT EXISTS (
					SELECT 1 FROM teams WHERE team_code = '${team_code}'
			) THEN
					RAISE EXCEPTION 'TEAM_DOES_NOT_EXIST';
			END IF;
			IF NOT EXISTS (
					SELECT 1 FROM team_members WHERE team_code = '${team_code}' AND user_id = '${user_id}' AND is_captain = TRUE
			) THEN
					RAISE EXCEPTION 'USER_IS_NOT_CAPTAIN';
			END IF;
			IF EXISTS (
				SELECT 1 FROM teams WHERE team_name = '${team_name}'
			)
			THEN
				RAISE EXCEPTION 'SELECT_ANOTHER_NAME';
			END IF;
		END $$;
`;
		const result = await db.query(query);

		if (result instanceof Error) {
			if (result.message === "TEAM_DOES_NOT_EXIST") {
				throw new ErrorHandler({
					message: "Team does not exist",
					status_code: 400,
					message_code: "TEAM_DOES_NOT_EXIST",
				});
			} else if (result.message === "USER_IS_NOT_CAPTAIN") {
				throw new ErrorHandler({
					message: "Only Cpatains have the permission to change team name !",
					status_code: 400,
					message_code: "USER_IS_NOT_CAPTAIN",
				});
			} else if (result.message === "SELECT_ANOTHER_NAME") {
				throw new ErrorHandler({
					message: "Selected name already exists !",
					status_code: 400,
					message_code: "TEAM_NAME_EXISTS",
				});
			} else {
				throw result;
			}
		}
	};
	protected deleteTeamMember = async (team_code: string, member_id: string) => {
		const query = `DELETE FROM team_members WHERE team_code = '${team_code}' AND user_id = '${member_id}';`;
		const result = await db.query(query);
		if (result instanceof Error) throw result;
	};

	protected getAllUserTeams = async (user_id: string) => {
		const query = `SELECT * FROM team_members WHERE user_id = $1`;
		const result = await db.query(query, [user_id]);
		if (result instanceof Error) throw result;
		return result.rows;
	};
}
