import EventsDb from './db';
import { IEvent } from './interface';
import logger, { LogTypes } from '../utils/logger';
import { v4 } from 'uuid';
import ErrorHandler from './../utils/errors.handler';

export default class EventsHelpers extends EventsDb {
  public getAllEventsHelper = async (): Promise<IEvent[]> => {
    logger('getAllEventsHelpers1', LogTypes.LOGS);
    const events = await this.fetchAllEvents();
    if (!events) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'Events not found',
        message_code: 'EVENTS_NOT_FOUND',
      });
    }
    return events;
  };

  public createEventHelper = async (eventData: Partial<IEvent>): Promise<IEvent> => {
    logger('createEventHelpers1', LogTypes.LOGS);
    eventData.created_at = new Date();
    eventData.updated_at = null;
    eventData.id = v4();
    const newevent = await this.createEvent(eventData);
    if (!newevent) {
      throw new ErrorHandler({
        status_code: 500,
        message: 'Event not created',
        message_code: 'EVENT_NOT_CREATED',
      });
    }
    return newevent;
  };

  public getEventHelper = async (event_code: string): Promise<IEvent> => {
    logger('getEventHelpers1', LogTypes.LOGS);
    const event = await this.fetchEvent(event_code);
    if (!event) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'Event not found',
        message_code: 'EVENT_NOT_FOUND',
      });
    }
    return event;
  };

  public deleteEventHelper = async (event_code: string): Promise<IEvent> => {
    logger('deleteEventHelpers1', LogTypes.LOGS);
    const event = await this.deleteEvent(event_code);
    if (!event) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'Event not found',
        message_code: 'EVENT_NOT_FOUND',
      });
    }
    return event;
  };
}
