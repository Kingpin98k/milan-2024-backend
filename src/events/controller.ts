import { RequestMethods } from '../utils/enums';
import { Request, Response } from 'express';
import ErrorHandler from '../utils/errors.handler';
import { IEvent, IResponse } from './interface';
import { EventsServices } from './services';
import logger, { LogTypes } from '../utils/logger';
import { errorHandler } from '../utils/ress.error';

export default class EventsController extends EventsServices {
  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      // const method = req.method,
      //   routeName = req.route.path.split('/')[1];
      const method = req.method;
      const routePath = req.route.path;
      logger(req, LogTypes.LOGS);
      let response: IResponse = {
          success: false,
          message_code: 'CONTROLLER_ERROR',
        },
        statusCode = 200;

      if (routePath === '/event') {
        if (method === RequestMethods.GET) {
          response = await this.getAllEventsController(req, res);
        } else if (method === RequestMethods.POST) {
          response = await this.createEventController(req, res);
        }
      } else if (routePath.startsWith('/event/') && req.params.code !== '') {
        logger('inside code route', LogTypes.LOGS);
        if (method === RequestMethods.GET) {
          response = await this.getEventController(req, res);
        } else if (method === RequestMethods.DELETE) {
          response = await this.deleteEventController(req, res);
        }
      }
      res.status(statusCode).send(response);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  private getAllEventsController = async (req: Request, res: Response): Promise<IResponse> => {
    const events = await this.getAllEventsService();
    logger(events, LogTypes.LOGS);
    return {
      success: true,
      data: events,
      message_code: 'GET_ALL_EVENTS_SUCCESS',
      message: 'Events fetched successfully',
    };
  };

  private createEventController = async (req: Request, res: Response): Promise<IResponse> => {
    // const { name, is_group_event, event_scope, club_name, max_group_size, event_code } = req.body;
    const eventData: Partial<IEvent> = req.body;
    // const event = await this.createEventService(
    //   name,
    //   is_group_event,
    //   event_scope,
    //   club_name,
    //   max_group_size,
    //   event_code
    // );
    const newevent = await this.createEventService(eventData);
    return {
      success: true,
      data: newevent,
      message_code: 'CREATE_EVENT_SUCCESS',
      message: 'Event created successfully',
    };
  };

  private getEventController = async (req: Request, res: Response): Promise<IResponse> => {
    logger(req.params.code, LogTypes.LOGS);
    const event_code = req.params.code;
    const event = await this.getEventService(event_code);
    return {
      success: true,
      data: event,
      message_code: 'GET_EVENT_SUCCESS',
      message: 'Event fetched successfully',
    };
  };

  private deleteEventController = async (req: Request, res: Response): Promise<IResponse> => {
    const event_code = req.params.code;
    const event = await this.deleteEventService(event_code);
    return {
      success: true,
      data: event,
      message_code: 'DELETE_EVENT_SUCCESS',
      message: 'Event deleted successfully',
    };
  };
}
