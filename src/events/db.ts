import db from './../config/pg.config';
import { IEvent, IEventUser } from './interface';
import logger, { LogTypes } from '../utils/logger';
import ErrorHandler from '../utils/errors.handler';

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
      reg_count: row.reg_count,
      mode: row.mode,
      created_at: row.created_at,
      updated_at: row.updated_at,
    })) as IEvent[];
  };

  createEvent = async (eventData: Partial<IEvent>): Promise<IEvent> => {
    logger('createEvent1', LogTypes.LOGS);
    const query = `INSERT INTO events (id, event_code, name, is_group_event, event_scope, club_name, max_group_size, reg_count, mode, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`;
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

  fetchEventByCode = async (event_code: string): Promise<IEvent> => {
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

  increaseCount = async (eventData: Partial<IEventUser>, updated_at: Date): Promise<IEvent> => {
    logger('IncrementCount1', LogTypes.LOGS);
    const query = `UPDATE events SET reg_count = reg_count + 1, updated_at = $1 WHERE event_code = $2 RETURNING *;`;
    const values = [updated_at, eventData.event_code];
    const res = await db.query(query, values);
    logger(res, LogTypes.LOGS);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEvent;
  };

  decreaseCount = async (eventData: Partial<IEventUser>, updated_at: Date): Promise<IEvent> => {
    logger('DecrementCount1', LogTypes.LOGS);
    const query = `UPDATE events SET reg_count = reg_count - 1, updated_at = CURRENT_TIMESTAMP WHERE event_code = $2 RETURNING *;`;
    const values = [updated_at, eventData.event_code];
    const res = await db.query(query, values);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEvent;
  };

  getUserByDetails = async (userData: Partial<IEventUser>): Promise<IEventUser | null> => {
    logger('getUserByDetails1', LogTypes.LOGS);
    const query = `SELECT * FROM event_users WHERE user_id = $1 AND event_code = $2 AND user_name = $3;`;
    const values = [userData.user_id, userData.event_code, userData.user_name];
    const res = await db.query(query, values);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEventUser;
  };

  createUser = async (userData: Partial<IEventUser>): Promise<IEventUser> => {
    logger('createUser1', LogTypes.LOGS);
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
    const res = await db.query(query, values);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEventUser;
  };

  deleteUser = async (userData: Partial<IEventUser>): Promise<IEventUser> => {
    logger('deleteUser1', LogTypes.LOGS);
    const query = 'DELETE FROM event_users WHERE event_code = $1 AND user_id = $2 AND event_id = $3 RETURNING *;';
    const values = [userData.event_code, userData.user_id, userData.event_id];
    const res = await db.query(query, values);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as unknown as IEventUser;
  };
}
