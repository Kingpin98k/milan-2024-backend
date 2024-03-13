import EventsHelpers from "./helpers";
import { IEvent, IEventUser, IResponse, IUser } from "./interface";
// import logger, { LogTypes } from '../utils/logger';
import ErrorHandler from "../utils/errors.handler";
import { response } from "express";
import logger, { LogTypes } from "../utils/logger";

export class EventsServices extends EventsHelpers {
	public async getAllEventsService(): Promise<IEvent[]> {
		// logger('getAllEventsServices1', LogTypes.LOGS);
		const events = await this.getAllEventsHelper();
		if (!events) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Events not found",
				message_code: "EVENTS_NOT_FOUND_GAES",
			});
		}
		return events;
	}

	public async createEventService(eventdata: Partial<IEvent>): Promise<IEvent> {
		// logger('createEventServices1', LogTypes.LOGS);
		if (eventdata.event_code === "") {
			throw new ErrorHandler({
				status_code: 400,
				message: "Event code is required",
				message_code: "EVENT_CODE_REQUIRED",
			});
		}
		const newevent = await this.createEventHelper(eventdata);
		if (!newevent) {
			throw new ErrorHandler({
				status_code: 500,
				message: "Event not created",
				message_code: "EVENT_NOT_CREATED",
			});
		}
		return newevent;
	}

	public async getEventService(event_code: string): Promise<IEvent> {
		// logger('getEventServices1', LogTypes.LOGS);
		const event = await this.getEventHelper(event_code);
		if (!event) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Event not found",
				message_code: "EVENT_NOT_FOUND_GES",
			});
		}
		return event;
	}

	public async deleteEventService(event_code: string): Promise<IEvent> {
		// logger('deleteEventServices1', LogTypes.LOGS);
		const event = await this.deleteEventHelper(event_code);
		if (!event) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Event not found",
				message_code: "EVENT_NOT_FOUND_DES",
			});
		}
		return event;
	}

	public async registerService(
		userData: Partial<IEventUser>
	): Promise<IEventUser> {
		// logger('registerService1', LogTypes.LOGS);
		const user = await this.registerHelper(userData);
		if (!user) {
			throw new ErrorHandler({
				status_code: 500,
				message: "User not registered",
				message_code: "USER_NOT_REGISTERED",
			});
		}
		return user;
	}
	public async getEventByUserService(user_id: string): Promise<any> {
		const user_existing_in_user_table = await this.fetchUserFromUsersTable(
			user_id
		);
		if (!user_existing_in_user_table) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found ",
				message_code: "USER_NOT_FOUND",
			});
		}
		const data = await this.fetchEventByUser(user_id);
		return data;
	}

	public async unregisterService(
		userData: Partial<IEventUser>
	): Promise<IEventUser> {
		// logger('unregisterService1', LogTypes.LOGS);
		const user = await this.unregisterHelper(userData);
		if (!user) {
			throw new ErrorHandler({
				status_code: 500,
				message: "User not unregistered",
				message_code: "USER_NOT_UNREGISTERED",
			});
		}
		return user;
	}

	public async getEventByClubService(club_name: string): Promise<IEvent[]> {
		const events = await this.getEventByClubHelper(club_name);
		if (!events) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Events not found",
				message_code: "EVENTS_NOT_FOUND_GEBCS",
			});
		}
		return events;
		// throw new ErrorHandler({
		//   status_code: 404,
		//   message: 'Not made yet',
		//   message_code: 'NOT MADE',
		// });
	}

	public async getEventUsersByCodeService(
		event_code: string
	): Promise<IEventUser[]> {
		// logger('getAllUsersByCodeService1', LogTypes.LOGS);
		const users = await this.getEventUsersByCodeHelper(event_code);
		if (!users) {
			throw new ErrorHandler({
				status_code: 404,
				message: "Users not found",
				message_code: "USERS_NOT_FOUND_GAUBCS",
			});
		}
		return users;
		// throw new ErrorHandler({
		//   status_code: 404,
		//   message: 'Not made yet',
		//   message_code: 'NOT MADE',
		// });
	}

	public async updateMaxCapService(
		event_code: string,
		new_cap: number
	): Promise<IEvent> {
		// logger('updateMaxCapService1', LogTypes.LOGS);
		const event = await this.updateMaxCapHelper(event_code, new_cap);
		if (!event) {
			throw new ErrorHandler({
				status_code: 500,
				message: "Max cap not updated",
				message_code: "MAX_CAP_NOT_UPDATED",
			});
		}
		return event;
	}

	public async getUserDetailByCodeService(
		event_code: string
	): Promise<IUser[]> {
		logger("getUserDetailByCodeService1", LogTypes.LOGS);
		const users = await this.getUserDetailByCodeHelper(event_code);
		if (users.length === 0) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No users found for this event",
				message_code: "NO_USER_FOUND_FOR_EVENT",
			});
		}
		return users;
	}

	public async activateEventService(
		event_code: string,
		op: string
	): Promise<any> {
		console.log("activateEventService1");
		// logger('activateEventService1', LogTypes.LOGS);
		let response;
		if (op === "activate") {
			const data = await this.activateEvent(event_code);
			if (!data) {
				throw new ErrorHandler({
					status_code: 500,
					message: "Event not found",
					message_code: "EVENT_NOT_FOUND",
				});
			} else if (!data.is_active === true) {
				throw new ErrorHandler({
					status_code: 500,
					message: "Event not activated",
					message_code: "EVENT_NOT_ACTIVATED",
				});
			}
			response = {
				success: true,
				message_code: "ACTIVATE_EVENT_SUCCESS",
				message: "Event activated successfully",
			};
		} else if (op === "deactivate") {
			const data = await this.deactivateEvent(event_code);
			if (!data) {
				throw new ErrorHandler({
					status_code: 500,
					message: "Event not found",
					message_code: "EVENT_NOT_FOUND",
				});
			} else if (!data.is_active === false) {
				throw new ErrorHandler({
					status_code: 500,
					message: "Event not deactivated",
					message_code: "EVENT_NOT_DEACTIVATED",
				});
			}
			response = {
				success: true,
				message_code: "DEACTIVATE_EVENT_SUCCESS",
				message: "Event deactivated successfully",
			};
		}

		return response;
	}

	public fetchAllUsersDetailsForEventService = async (
		event_code: string
	): Promise<IEventUser[]> => {
		const result = await this.fetchAllUsersDetailsForEvent(event_code);
		return result;
	};
}
