import { RequestMethods } from '../utils/enums';
import { Request, Response } from 'express';
import ErrorHandler from '../utils/errors.handler';
import { IEvent, IResponse } from './interface';
import { EventsServices } from './services';
import logger, { LogTypes } from '../utils/logger';

export default class EventsController extends EventsServices {
  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      const method = req.method,
        routeName = req.route.path.split('/')[1];
      const { table_id, session_id } = req.headers;
      let response: IResponse = {
          success: false,
          message_code: 'GET_ALL_ORDERS_ERROR',
        },
        statusCode = 200;

      if (routeName === 'events') {
        if (method === RequestMethods.GET) {
          response = await this.getAllEventsController(req, res);
        } else if (method === RequestMethods.POST) {
          response = await this.createEventController(req, res);
        }
      }
      res.status(statusCode).send(response);
    } catch (error) {
      new ErrorHandler({
        status_code: 500,
        message: 'Error calling getAllEventsController',
        message_code: 'GET_ALL_ORDERS_ERROR',
      });
    }
  };

  private getAllEventsController = async (req: Request, res: Response): Promise<IResponse> => {
    const events = await this.getAllEventsService();
    return {
      success: true,
      data: events,
      message_code: 'GET_ALL_ORDERS_SUCCESS',
      message: 'Events fetched successfully',
    };
  };

  private createEventController = async (req: Request, res: Response): Promise<IResponse> => {
    const { name, is_group_event, event_scope, club_name, max_group_size, event_code } = req.body;
    // const eventData: Partial<IEvent> = req.body;
    const event = await this.createEventService(
      // eventData.name,
      // eventData.is_group_event,
      // eventData.event_scope,
      // eventData.club_name,
      // eventData.max_group_size,
      // eventData.event_code
      name,
      is_group_event,
      event_scope,
      club_name,
      max_group_size,
      event_code
    );
    return {
      success: true,
      data: event,
      message_code: 'CREATE_EVENT_SUCCESS',
      message: 'Event created successfully',
    };
  };
}
