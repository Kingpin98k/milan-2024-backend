import db from './../config/pg.config';
import { IEvent } from './interface';
import logger, { LogTypes } from '../utils/logger';

export default class EventsDb {
  fetchAllEvents = async (): Promise<IEvent[]> => {
    logger('fetchAllEvents1', LogTypes.LOGS);
    const query = 'SELECT * FROM events;';
    let res = await db.query(query);
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
    })) as IEvent[];
  };

  createEvent = async (eventData: Partial<IEvent>): Promise<IEvent> => {
    logger('createEvent1', LogTypes.LOGS);
    const query = `INSERT INTO events (id, event_code, name, is_group_event, event_scope, club_name, max_group_size, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
    const values = [
      eventData.id,
      eventData.event_code,
      eventData.name,
      eventData.is_group_event,
      eventData.event_scope,
      eventData.club_name,
      eventData.max_group_size,
      eventData.created_at,
      eventData.updated_at,
    ];
    logger(values, LogTypes.LOGS);
    const res = await db.query(query, values);
    if (res instanceof Error) {
      logger(res, LogTypes.LOGS);
      throw res;
    }
    logger(res.rows[0], LogTypes.LOGS);
    return res.rows[0] as unknown as IEvent;
  };

  fetchEvent = async (event_code: string): Promise<IEvent> => {
    logger('fetchEvent1', LogTypes.LOGS);
    const query = 'SELECT * FROM events WHERE event_code = $1;';
    const values = [event_code];
    const res = await db.query(query, values);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEvent;
  };

  deleteEvent = async (event_code: string): Promise<IEvent> => {
    logger('deleteEvent1', LogTypes.LOGS);
    const query = 'DELETE FROM events WHERE event_code = $1 RETURNING *;';
    const values = [event_code];
    const res = await db.query(query, values);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEvent;
  };
}
