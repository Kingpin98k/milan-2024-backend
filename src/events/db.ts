import db from './../config/pg.config';
import { IEvent } from './interface';
import logger, { LogTypes } from '../utils/logger';

export default class EventsDb {
  fetchAllEvents = async (): Promise<IEvent[]> => {
    logger('fetchAllEvents1', LogTypes.LOGS);
    const query = 'SELECT * FROM events;';
    const res = await db.query(query);
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
      created_at: row.created_at,
      updated_at: row.updated_at,
    })) as unknown as IEvent[];
  };
}
