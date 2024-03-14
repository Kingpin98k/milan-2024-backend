import EventsDb from "./db";
import db from "../config/pg.config";
import { IEvent, IEventUser, IUser } from "./interface";
// import logger, { LogTypes } from '../utils/logger';
import { v4 } from "uuid";
import ErrorHandler from "./../utils/errors.handler";
import { Client } from "pg";
import logger, { LogTypes } from "../utils/logger";

export default class EventsHelpers extends EventsDb {
	public getAllEventsHelper = async (): Promise<IEvent[]> => {
		// logger('getAllEventsHelpers1', LogTypes.LOGS);
		const events = await this.fetchAllEvents();
		if (!events) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Events not found",
				message_code: "EVENTS_NOT_FOUND",
			});
		}
		return events;
	};

	public createEventHelper = async (
		eventData: Partial<IEvent>
	): Promise<IEvent> => {
		// logger('createEventHelpers1', LogTypes.LOGS);
		const existingevent = await this.fetchEventByCode(
			eventData.event_code || ""
		);
		if (existingevent) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Event with this code already exists",
				message_code: "DUPLICATE_EVENT_CODE",
			});
		}
		eventData.created_at = new Date();
		eventData.updated_at = null;
		eventData.id = v4();
		eventData.reg_count = 0;
		const newevent = await this.createEvent(eventData);
		if (!newevent) {
			throw new ErrorHandler({
				status_code: 500,
				message: "Event not created",
				message_code: "EVENT_NOT_CREATED_CEH",
			});
		}
		return newevent;
	};

	public getEventHelper = async (event_code: string): Promise<IEvent> => {
		// logger('getEventHelpers1', LogTypes.LOGS);
		const event = await this.fetchEventByCode(event_code);
		if (!event) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Event not found",
				message_code: "EVENT_NOT_FOUND_GEH",
			});
		}
		return event;
	};

	public deleteEventHelper = async (event_code: string): Promise<IEvent> => {
		// logger('deleteEventHelpers1', LogTypes.LOGS);
		const event = await db.transaction(async () => {
			const event1 = await this.fetchEventByCode(event_code);
			if (!event1) {
				throw new ErrorHandler({
					status_code: 404,
					message: "Event not found",
					message_code: "EVENT_NOT_FOUND_DEH",
				});
			}
			const users = await this.deleteAllUsersByCode(event_code);
			if (!users) {
				throw new ErrorHandler({
					status_code: 404,
					message: "user deletion failed",
					message_code: "USER_DELETION_FAILED",
				});
			}
			const event = await this.deleteEvent(event_code);
			if (!event) {
				throw new ErrorHandler({
					status_code: 404,
					message: "Event not deleted",
					message_code: "EVENT_NOT_DELETED",
				});
			}
			return event;
		});
		return event;
	};

	public registerHelper = async (
		userData: Partial<IEventUser>
	): Promise<IEventUser> => {
		// logger('registerHelpers1', LogTypes.LOGS);
		userData.id = v4();
		userData.created_at = new Date();
		userData.updated_at = null;
		const user_existing_in_user_table = await this.fetchUserFromUsersTable(
			userData.user_id
		);
		if (!user_existing_in_user_table) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found ",
				message_code: "USER_NOT_FOUND",
			});
		}
		if (!user_existing_in_user_table.is_ticket_issued) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Ticket not issued for this user",
				message_code: "TICKET_NOT_ISSUED",
			});
		}

		const existinguser = await this.getUserByDetails(userData);
		if (existinguser) {
			throw new ErrorHandler({
				status_code: 400,
				message: "User already registered",
				message_code: "USER_ALREADY_REGISTERED",
			});
		}

		const event = await this.fetchEventByCode(userData.event_code || "");
		if (!event) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Event not found",
				message_code: "EVENT_NOT_FOUND",
			});
		} else {
			if (
				event.event_scope === "non-srm" &&
				user_existing_in_user_table.is_srm_ktr
			) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Event is not for SRM KTR students !",
					message_code: "EVENT_SCOPE_MISMATCH",
				});
			}
		}

		const user = await db.transaction(async (client: Client) => {
			const updated_at = new Date();
			const event = await this.increaseCount(userData, updated_at, client);
			if (!event) {
				throw new ErrorHandler({
					status_code: 404,
					message: "Event not found",
					message_code: "EVENT_NOT_FOUND",
				});
			}
			if (event.is_active === false) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Event is not active",
					message_code: "EVENT_NOT_ACTIVE",
				});
			}
			if (event.reg_count > event.max_cap) {
				throw new ErrorHandler({
					status_code: 400,
					message: "Event is full",
					message_code: "EVENT_CAP_FULL",
				});
			}
			userData.event_id = event.id;
			const user = await this.createUser(userData, client);
			if (!user) {
				throw new ErrorHandler({
					status_code: 404,
					message: "user creation failed",
					message_code: "EVENT_REGISTRATION_FAILED",
				});
			}
			return user;
		});
		return user;
	};

	public unregisterHelper = async (
		userData: Partial<IEventUser>
	): Promise<IEventUser> => {
		// logger('unregisterHelpers1', LogTypes.LOGS);
		// const user_existing_in_user_table = await this.fetchUserFromUsersTable(userData.user_id);
		// if (!user_existing_in_user_table) {
		//   throw new ErrorHandler({
		//     status_code: 404,
		//     message: 'User not found in users table',
		//     message_code: 'USER_NOT_FOUND_IN_USERS',
		//   });
		// }
		const existinguser = await this.getUserByDetails(userData);
		if (!existinguser) {
			throw new ErrorHandler({
				status_code: 400,
				message: "User not registered",
				message_code: "USER_NOT_REGISTERED",
			});
		}

		const isUserInTeam = await this.isUserInTeam(
			userData.user_id || "",
			userData.event_code || ""
		);

		if (isUserInTeam) {
			throw new ErrorHandler({
				status_code: 400,
				message:
					"User is in a team realted to the event, so cannot unregister !",
				message_code: "USER_IN_TEAM",
			});
		}

		const user = await db.transaction(async () => {
			const updated_at = new Date();
			const event = await this.decreaseCount(userData, updated_at);
			if (!event) {
				throw new ErrorHandler({
					status_code: 404,
					message: "Event not found",
					message_code: "DEC_REG_COUNT_FAILED",
				});
			}
			userData.event_id = event.id;
			const user = await this.deleteUser(userData);
			if (!user) {
				throw new ErrorHandler({
					status_code: 404,
					message: "user not found",
					message_code: "DELETE_USER_FAILED",
				});
			}
			return user;
		});
		return user;
	};

	public getEventByClubHelper = async (
		club_name: string
	): Promise<IEvent[]> => {
		// logger('getEventByClubHelpers1', LogTypes.LOGS);
		const events = await this.fetchEventByClub(club_name);
		if (!events) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Events not found",
				message_code: "EVENTS_NOT_FOUND_GEBCH",
			});
		}
		if (events.length === 0) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No events found for this club",
				message_code: "CLUB_HAS_NO_EVENTS",
			});
		}
		return events;
	};

	public getEventUsersByCodeHelper = async (
		event_code: string
	): Promise<IEventUser[]> => {
		// logger('getAllUsersByCodeHelpers1', LogTypes.LOGS);
		const users = await this.fetchEventUsersByCode(event_code);
		if (!users) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Users not found",
				message_code: "USERS_NOT_FOUND",
			});
		}
		if (!users.length) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No users found for this event",
				message_code: "EVENT_HAS_NO_USERS",
			});
		}
		return users;
	};

	public getUserDetailByCodeHelper = async (
		event_code: string
	): Promise<IUser[]> => {
		logger("getUserDetailByCodeHelper1", LogTypes.LOGS);
		const eventUsers = await this.fetchEventUsersByCode(event_code);
		logger(eventUsers, LogTypes.LOGS);
		if (!eventUsers) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No event users found",
				message_code: "NO_USER_FOUND_FOR_EVENT",
			});
		}
		if (!eventUsers.length) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No users found for this event",
				message_code: "EVENT_HAS_NO_USERS",
			});
		}
		const userIds = eventUsers.map((user) => user.user_id);

		const users: IUser[] = await Promise.all(
			userIds.map((userId) => this.fetchUserFromUsersTable(userId))
		);
		return users;
	};

	public updateMaxCapHelper = async (
		event_code: string,
		new_cap: number
	): Promise<IEvent> => {
		// logger('updateMaxCapHelpers1', LogTypes.LOGS);

		const eventData = {
			event_code: event_code,
			max_cap: new_cap,
			updated_at: new Date(),
		};
		const updatedevent = await this.updateMaxCap(eventData);
		if (!updatedevent) {
			throw new ErrorHandler({
				status_code: 400,
				message: "New cap is less than current registrations",
				message_code: "NEW_CAP_LESS_THAN_REG_COUNT",
			});
		}
		return updatedevent;
	};

	public fetchAllUsersDetailsForEventHelper = async (
		event_code: string
	): Promise<IEventUser[]> => {
		// logger('fetchAllUsersDetailsForEventHelpers1', LogTypes.LOGS);
		const users = await this.fetchAllUsersDetailsForEvent(event_code);
		if (!users) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Users not found",
				message_code: "USERS_NOT_FOUND",
			});
		}
		return users;
	};
}
