import db from "./../config/pg.config";
import { IEvent, IEventUser, IUser } from "./interface";
import logger, { LogTypes } from "../utils/logger";
import ErrorHandler from "../utils/errors.handler";
import { Client } from "pg";

export default class EventsDb {
	protected fetchAllEvents = async (): Promise<any> => {
		// logger('fetchAllEvents1', LogTypes.LOGS);
		const query = "SELECT * FROM events;";
		let res = await db.query(query);
		if (res instanceof Error) {
			throw res;
		}

		return res.rows;
	};

	protected createEvent = async (
		eventData: Partial<IEvent>,
		client?: Client
	): Promise<IEvent> => {
		// logger("createEvent1", LogTypes.LOGS);
		const query = `INSERT INTO events (id, event_code, name, is_group_event, event_scope, club_name, max_group_size, reg_count, mode, max_cap, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`;
		const values = [
			eventData.id,
			eventData.event_code,
			eventData.name,
			eventData.is_group_event,
			eventData.event_scope,
			eventData.club_name,
			eventData.max_group_size,
			eventData.reg_count,
			eventData.mode,
			eventData.max_cap,
			eventData.is_active,
			eventData.created_at,
			eventData.updated_at,
		];
		let res;
		if (client) {
			res = await client.query(query, values);
		} else {
			res = await db.query(query, values);
		}
		if (res instanceof Error) {
			// logger(res, LogTypes.LOGS);
			throw res;
		}
		// logger(res.rows[0], LogTypes.LOGS);
		return res.rows[0] as unknown as IEvent;
	};

	protected fetchEventByCode = async (event_code: string): Promise<IEvent> => {
		// logger("fetchEvent1", LogTypes.LOGS);
		const query = "SELECT * FROM events WHERE event_code = $1;";
		const values = [event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEvent;
	};

	protected fetchEventByUser = async (user_id: string): Promise<IEvent[]> => {
		const query = `SELECT json_agg(json_build_object(
			'event_code', e.event_code,
			'event_name', e.name,
			'is_group_event', e.is_group_event
			)) AS events
			FROM event_users eu
			JOIN events e ON eu.event_code = e.event_code
			WHERE eu.user_id = $1;`;
		const values = [user_id];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0];
	};

	protected fetchEventByClub = async (club_name: string): Promise<IEvent[]> => {
		// logger("fetchEventByClub1", LogTypes.LOGS);
		const query = "SELECT * FROM events WHERE club_name = $1;";
		const values = [club_name];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows.map((row: any) => ({
			id: row.id,
			event_code: row.event_code,
			name: row.name,
			is_group_event: row.is_group_event,
			event_scope: row.event_scope,
			club_name: row.club_name,
			max_group_size: row.max_group_size,
			reg_count: row.reg_count,
			mode: row.mode,
			max_cap: row.max_cap,
			is_active: row.is_active,
			created_at: row.created_at,
			updated_at: row.updated_at,
		})) as IEvent[];
	};

	protected deleteEvent = async (event_code: string): Promise<IEvent> => {
		// logger("deleteEvent1", LogTypes.LOGS);
		const query = "DELETE FROM events WHERE event_code = $1 RETURNING *;";
		const values = [event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEvent;
	};

	protected increaseCount = async (
		eventData: Partial<IEventUser>,
		updated_at: Date,
		client?: Client
	): Promise<IEvent> => {
		// logger("IncrementCount1", LogTypes.LOGS);
		const query = `UPDATE events SET reg_count = reg_count + 1, updated_at = $1 WHERE event_code = $2 RETURNING *;`;
		const values = [updated_at, eventData.event_code];
		let res;
		if (client) {
			res = await client.query(query, values);
		} else {
			res = await db.query(query, values);
		}
		// logger(res, LogTypes.LOGS);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEvent;
	};

	protected decreaseCount = async (
		eventData: Partial<IEventUser>,
		updated_at: Date
	): Promise<IEvent> => {
		// logger("DecrementCount1", LogTypes.LOGS);
		const query = `UPDATE events SET reg_count = reg_count - 1, updated_at = $1 WHERE event_code = $2 RETURNING *;`;
		const values = [updated_at, eventData.event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEvent;
	};

	protected fetchEventUsersByCode = async (
		event_code: string
	): Promise<IEventUser[]> => {
		logger("fetchAllUsersByCode1", LogTypes.LOGS);
		const query = "SELECT * FROM event_users WHERE event_code = $1;";
		const values = [event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows.map((row: any) => ({
			id: row.id,
			user_id: row.user_id,
			event_id: row.event_id,
			event_code: row.event_code,
			user_name: row.user_name,
			created_at: row.created_at,
			updated_at: row.updated_at,
		})) as IEventUser[];
	};

	protected fetchUserFromUsersTable = async (
		user_id: string | undefined
	): Promise<IUser> => {
		// logger("fetchUserFromUsersTable1", LogTypes.LOGS);
		const query =
			"SELECT * FROM users WHERE id = $1 AND is_deleted=false LIMIT 1;";
		const values = [user_id];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IUser;
	};

	protected fetchAllUsersDetailsForEvent = async (
		event_code: string
	): Promise<IEventUser[]> => {
		const query = `SELECT u.*
			FROM event_users eu
			JOIN users u ON eu.user_id = u.ID
			WHERE eu.event_code = $1;
		`;
		const values = [event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows as unknown as IEventUser[];
	};

	protected getUserByDetails = async (
		userData: Partial<IEventUser>
	): Promise<IEventUser | null> => {
		// logger("getUserByDetails1", LogTypes.LOGS);
		const query = `SELECT * FROM event_users WHERE user_id = $1 AND event_code = $2 AND user_name = $3;`;
		const values = [userData.user_id, userData.event_code, userData.user_name];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEventUser;
	};

	protected createUser = async (
		userData: Partial<IEventUser>,
		client: Client
	): Promise<IEventUser> => {
		// logger("createUser1", LogTypes.LOGS);
		const query = `INSERT INTO event_users (id, user_id, event_id, event_code, user_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
		const values = [
			userData.id,
			userData.user_id,
			userData.event_id,
			userData.event_code,
			userData.user_name,
			userData.created_at,
			userData.updated_at,
		];
		let res;
		if (client) {
			res = await client.query(query, values);
		} else {
			res = await db.query(query, values);
		}
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEventUser;
	};

	protected deleteUser = async (
		userData: Partial<IEventUser>
	): Promise<IEventUser> => {
		// logger("deleteUser1", LogTypes.LOGS);
		const query =
			"DELETE FROM event_users WHERE event_code = $1 AND user_id = $2 AND event_id = $3 RETURNING *;";
		const values = [userData.event_code, userData.user_id, userData.event_id];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEventUser;
	};

	protected deleteAllUsersByCode = async (
		event_code: string
	): Promise<IEventUser[]> => {
		// logger("deleteAllUsersByCode1", LogTypes.LOGS);
		const query = "DELETE FROM event_users WHERE event_code = $1 RETURNING *;";
		const values = [event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows as unknown as IEventUser[];
	};

	protected updateMaxCap = async (
		eventData: Partial<IEvent>
	): Promise<IEvent> => {
		// logger("updateMaxCap1", LogTypes.LOGS);
		const query = `UPDATE events 
						SET max_cap = $1, 
							updated_at = $2 
						WHERE event_code = $3 
							AND $1 > (SELECT reg_count FROM events WHERE event_code = $3)
						RETURNING *;`;
		const values = [
			eventData.max_cap,
			eventData.updated_at,
			eventData.event_code,
		];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as IEvent;
	};

	protected isUserInTeam = async (user_id: string, event_code: string) => {
		const query = `SELECT id FROM team_members WHERE user_id = $1 AND event_id = (SELECT event_id FROM events WHERE event_code = $2);`;
		const values = [user_id, event_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0];
	};

	protected activateEvent = async (eventCode: string): Promise<any> => {
		logger("activateEventDB", LogTypes.LOGS);
		const query = `UPDATE events SET is_active = true WHERE event_code = $1 RETURNING *`;
		const values = [eventCode];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0];
	};
	protected deactivateEvent = async (eventCode: string): Promise<any> => {
		logger("DEactivateEventDB", LogTypes.LOGS);
		const query = `UPDATE events SET is_active = false WHERE event_code = $1 RETURNING *;`;
		const values = [eventCode];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0];
	};

	protected deleteTeam = async (team_code: string): Promise<any> => {
		// logger("deleteTeam1", LogTypes.LOGS);
		const query = "DELETE FROM teams WHERE team_code = $1 RETURNING *;";
		const values = [team_code];
		const res = await db.query(query, values);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0];
	};

	//   fetchUserDetailByCode = async (event_code: string): Promise<IUser[]> => {
	//     const query = `SELECT * FROM users WHERE event_code = $1;`;
	//     const values = [event_code];
	//     const res = await db.query(query, values);
	//     if (res instanceof Error) {
	//       throw res;
	//     }
	//     return res.rows as unknown as IUser[];
	//   }

	protected fetchUserById = async (userId: string): Promise<IUser> => {
		const query = `SELECT * FROM users WHERE id = $1;`;
		const values = [userId];

		const res = await db.query(query, values);
		if (res instanceof Error || !res.rows || res.rows.length === 0) {
			throw res;
		}
		return res.rows[0] as unknown as IUser;
	};
}
