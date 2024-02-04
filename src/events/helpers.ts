import EventsDb from './db';
import { IEvent } from './interface';
import logger, { LogTypes } from '../utils/logger';
import { v4 } from 'uuid';

export default class EventsHelpers extends EventsDb {
  public getAllEventsHelper = async (): Promise<IEvent[]> => {
    logger('getAllEventsHelpers1', LogTypes.LOGS);
    const events = await this.fetchAllEvents();
    return events;
  };

  public createEventHelper = async (eventData: Partial<IEvent>): Promise<IEvent> => {
    logger('createEventHelpers1', LogTypes.LOGS);
    eventData.created_at = new Date();
    eventData.updated_at = null;
    eventData.id = v4();
    logger(eventData.name, LogTypes.LOGS);
    logger(eventData, LogTypes.LOGS);
    const newevent = await this.createEvent(eventData);
    logger(newevent, LogTypes.LOGS);
    return newevent;
  };
}
