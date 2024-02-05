import EventsHelpers from './helpers';
import { IEvent, IResponse } from './interface';
import logger, { LogTypes } from '../utils/logger';

export class EventsServices extends EventsHelpers {
  public async getAllEventsService(): Promise<IEvent[]> {
    logger('getAllEventsServices1', LogTypes.LOGS);
    const events = await this.getAllEventsHelper();
    return events;
  }

  public async createEventService(
    name: string,
    is_group_event: boolean,
    event_scope: string,
    club_name: string,
    max_group_size: number,
    event_code: string
  ): Promise<IEvent> {
    logger('createEventServices1', LogTypes.LOGS);
    const event = await this.createEventHelper(
      name,
      is_group_event,
      event_scope,
      club_name,
      max_group_size,
      event_code
    );
    return event;
  }
}
