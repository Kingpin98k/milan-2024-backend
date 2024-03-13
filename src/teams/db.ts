import {
	ITeamCreateReqObject,
	ITeamJoinReqObject,
	ITeamMemberAddReqObject,
	ITeamResObject,
	ITeamUpdateNameReqObject,
	IUserTeamForEventReqObject,
} from "./interface";
import db from "../config/pg.config";
import ErrorHandler from "../utils/errors.handler";
import { Client } from "pg";
import logger, { LogTypes } from "../utils/logger";

export default class TeamsDB {
	protected createTeam = async (
		reqObj: any,
		client?: Client
	): Promise<ITeamResObject> => {
		console.log(reqObj);

		const query = `
				INSERT INTO teams (id, team_name, user_count, event_id, team_code, event_code, created_at, updated_at)
        VALUES ($1, $2, $3, (SELECT id FROM events WHERE event_code = $4), $5, $6, $7, $8)
        RETURNING *;
    `;
		const values = [
			reqObj.id,
			reqObj.team_name,
			reqObj.user_count || 1,
			reqObj.event_code,
			reqObj.team_code,
			reqObj.event_code,
			reqObj.created_at,
			reqObj.updated_at,
		];

		let result;
		if (client) {
			result = await client.query(query, values);
		} else {
			result = await db.query(query, values);
		}

		if (result instanceof Error) throw result;

		return result.rows[0] as unknown as ITeamResObject;
	};

	protected joinTeam = async (
		reqObj: any, // Assuming ITeamMemberAddReqObject is the structure of your reqObj
		is_captain: boolean = false,
		client?: Client
	) => {
		reqObj.is_captain = is_captain;
		const query = `
        INSERT INTO team_members (id, user_id, team_id, is_captain, event_id, team_code, created_at, updated_at)
        VALUES ($1, $2, $3, $4, (SELECT id FROM events WHERE event_code = $5), $6, $7, $8)
        RETURNING *;
    `;
		const values = [
			reqObj.id,
			reqObj.user_id,
			reqObj.team_id,
			reqObj.is_captain,
			reqObj.event_code,
			reqObj.team_code,
			reqObj.created_at,
			reqObj.updated_at,
		];
		let result;
		if (client) {
			result = await client.query(query, values);
		} else {
			result = await db.query(query, values);
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
			} else if (result.message === "MAX_GROUP_SIZE_REACHED") {
				throw new ErrorHandler({
					message: "Max group size reached",
					status_code: 400,
					message_code: "MAX_GROUP_SIZE_REACHED",
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

	protected deleteTeam = async (team_code: string, client?: Client) => {
		const query = `DELETE FROM teams WHERE team_code = $1`;

		let result;
		if (client) {
			result = await client.query(query, [team_code]);
		} else {
			result = await db.query(query, [team_code]);
		}
		if (result instanceof Error) throw result;
	};

	protected increaseUserCount = async (team_id: string, client?: Client) => {
		const query = `UPDATE teams SET user_count = user_count + 1 WHERE team_code = $1 RETURNING *`;
		let result;
		if (client) {
			result = await client.query(query, [team_id]);
		} else {
			result = await db.query(query, [team_id]);
		}
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected decreaseUserCount = async (team_code: string, client?: Client) => {
		const query = `UPDATE teams SET user_count = user_count - 1 WHERE team_code = $1 RETURNING *`;
		let result;
		if (client) {
			result = await client.query(query, [team_code]);
		} else {
			result = await db.query(query, [team_code]);
		}
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected checkIfExistInEvent = async (
		team_code: string,
		user_id: string
	) => {
		const query = `SELECT *
			FROM event_users eu
			JOIN teams t ON eu.event_id = t.event_id AND eu.event_code = t.event_code
			WHERE eu.user_id = $2
			AND t.team_code = $1;		
		`;
		const result = await db.query(query, [team_code, user_id]);
		if (result instanceof Error) throw result;
		return result.rows[0];
	};

	protected deleteTeamMembers = async (team_code: string, client?: Client) => {
		const query = `DELETE FROM team_members WHERE team_code = $1`;
		let result;
		if (client) {
			result = await client.query(query, [team_code]);
		} else {
			result = await db.query(query, [team_code]);
		}

		if (result instanceof Error) throw result;
	};

	protected leaveTeam = async (
		team_code: string,
		user_id: string,
		client?: Client
	) => {
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

		let result;
		if (client) {
			result = await client.query(query);
		} else {
			result = await db.query(query);
		}
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

	protected getUserTeamData = async (reqObj: any) => {
		const query = `SELECT
    t.team_name,
    t.team_code,
    tm.is_captain
		FROM
				team_members tm
		JOIN
				teams t ON tm.team_id = t.id
		WHERE
				tm.event_id = (SELECT id FROM events WHERE event_code = $2)
				AND tm.user_id = $1;`;

		const result = await db.query(query, [reqObj.user_id, reqObj.event_code]);
		if (result instanceof Error) throw result;

		return result.rows[0];
	};

	protected getTeamMembers = async (reqObj: IUserTeamForEventReqObject) => {
		const query = `SELECT json_agg(json_build_object(
			'name', u.name,
			'id', u.id,
			'email', u.email,
			'gender', u.gender,
			'isCaptain', tm.is_captain
			)) AS members
			FROM team_members tm
			JOIN users u ON tm.user_id = u.id
			WHERE tm.team_code = (
					SELECT team_code
					FROM team_members
					WHERE event_id = (SELECT id FROM events WHERE event_code = $1) AND user_id = $2
			);
	`;
		const result = await db.query(query, [reqObj.event_code, reqObj.user_id]);
		if (result instanceof Error) throw result;

		return result.rows[0] || null;
	};

	protected checkUserAndEventExistance = async (
		user_id: string,
		event_code: string,
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
		// 				SELECT 1 FROM teams WHERE team_name = teamName
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

		const res = await db.query(query, [user_id, event_code, team_name]);

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
			} else if (res.message === "EVENT_NOT_FOR_KTR_STUDENTS") {
				throw new ErrorHandler({
					message: "Event is not for KTR students",
					status_code: 400,
					message_code: "EVENT_NOT_FOR_KTR_STUDENTS",
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

	protected getAllTeamMembers = async (team_id: string) => {
		const query = `SELECT
    tm.user_id,
    tm.is_captain,
    u.name,
    u.email,
    u.phone_number,
    u.college_name,
    u.gender
		FROM
				team_members tm
		JOIN
				users u ON tm.user_id = u.id
		WHERE
				tm.team_id = $1;
`;
		const result = await db.query(query, [team_id]);
		if (result instanceof Error) throw result;
		return result.rows[0];
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
		const query = `SELECT
    tm.*,
    t.team_name,
    t.event_code
		FROM
				team_members tm
		JOIN
				teams t ON tm.team_code = t.team_code
		WHERE
				tm.user_id = $1;
`;
		const result = await db.query(query, [user_id]);
		if (result instanceof Error) throw result;
		return result.rows;
	};

	protected getAllTeamsOfEvent = async (event_code: string) => {
		const query = `SELECT * FROM teams WHERE event_code = $1`;
		const result = await db.query(query, [event_code]);

		if (result instanceof Error) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Error fetching teams of event",
				message_code: "ERROR_FETCHING_TEAMS_OF_EVENT",
			});
		}
		return result.rows;
	};
}
