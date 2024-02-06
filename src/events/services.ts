import EventsHelpers from './helpers';
import { IEvent, IResponse } from './interface';
import logger, { LogTypes } from '../utils/logger';
import ErrorHandler from '../utils/errors.handler';

export class EventsServices extends EventsHelpers {
  public async getAllEventsService(): Promise<IEvent[]> {
    logger('getAllEventsServices1', LogTypes.LOGS);
    const events = await this.getAllEventsHelper();
    if (!events) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'Events not found',
        message_code: 'EVENTS_NOT_FOUND',
      });
    }
    return events;
  }

  public async createEventService(
    // name: string,
    // is_group_event: boolean,
    // event_scope: string,
    // club_name: string,
    // max_group_size: number,
    // event_code: string
    eventdata: Partial<IEvent>
  ): Promise<IEvent> {
    logger('createEventServices1', LogTypes.LOGS);
    const newevent = await this.createEventHelper(eventdata);
    if (!newevent) {
      throw new ErrorHandler({
        status_code: 500,
        message: 'Event not created',
        message_code: 'EVENT_NOT_CREATED',
      });
    }
    return newevent;
  }

  public async getEventService(event_code: string): Promise<IEvent> {
    logger('getEventServices1', LogTypes.LOGS);
    const event = await this.getEventHelper(event_code);
    if (!event) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'Event not found',
        message_code: 'EVENT_NOT_FOUND',
      });
    }
    return event;
  }

  public async deleteEventService(event_code: string): Promise<IEvent> {
    logger('deleteEventServices1', LogTypes.LOGS);
    const event = await this.deleteEventHelper(event_code);
    if (!event) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'Event not found',
        message_code: 'EVENT_NOT_FOUND',
      });
    }
    return event;
  }
}
