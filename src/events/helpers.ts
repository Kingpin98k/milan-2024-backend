import EventsDb from './db';
import { IEvent } from './interface';
import logger, { LogTypes } from '../utils/logger';

export default class EventsHelpers extends EventsDb {
  public getAllEventsHelper = async (): Promise<IEvent[]> => {
    logger('getAllEventsHelpers1', LogTypes.LOGS);
    const events = await this.fetchAllEvents();
    return events;
  };

  public createEventHelper = async (
}
