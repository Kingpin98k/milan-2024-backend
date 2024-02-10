import { RequestMethods } from '../utils/enums';
import { Request, Response } from 'express';
import ErrorHandler from '../utils/errors.handler';
import { IEvent, IEventUser, IResponse } from './interface';
import { EventsServices } from './services';
import logger, { LogTypes } from '../utils/logger';
import { errorHandler } from '../utils/ress.error';
import { EventRoutes } from './enums';

export default class EventsController extends EventsServices {
  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      const method = req.method;
      // logger(req.route.path.split('/')[0], LogTypes.LOGS);
      logger(req, LogTypes.LOGS);

      const routeName = req.route.path.split('/')[1];
      const route = req.url.split('/')[1];
      logger(route, LogTypes.LOGS);
      logger('🍀🍀🍀🍀🍀🍀', LogTypes.LOGS);
      logger(routeName, LogTypes.LOGS);
      // const routePath = req.route.path;
      // logger(routePath, LogTypes.LOGS);
      let response: IResponse = {
          success: false,
          message_code: 'CONTROLLER_ERROR',
        },
        statusCode = 200;

      if (method === RequestMethods.GET && route === EventRoutes.EVENT) {
        response = await this.getAllEventsController(req, res);
      } else if (method === RequestMethods.POST && route === EventRoutes.EVENT) {
        response = await this.createEventController(req, res);
      } else if (method === RequestMethods.GET && routeName === EventRoutes.EVENT_CODE) {
        response = await this.getEventController(req, res);
      } else if (method === RequestMethods.DELETE && route === EventRoutes.UNREGISTER) {
        statusCode = 204;
        response = await this.unregisterController(req, res);
      } else if (method === RequestMethods.DELETE && routeName === EventRoutes.EVENT_CODE) {
        statusCode = 204;
        response = await this.deleteEventController(req, res);
      } else if (method === RequestMethods.POST && route === EventRoutes.REGISTER) {
        response = await this.registerController(req, res);
      } else if (method === RequestMethods.GET && routeName === EventRoutes.GET_EVENT_BY_CLUB) {
        response = await this.getEventByClubController(req, res);
      } else if (method === RequestMethods.GET && routeName === EventRoutes.GET_ALL_USERS_BY_CODE) {
        response = await this.getAllUsersByCodeController(req, res);
      } else if (method === RequestMethods.GET && routeName === EventRoutes.GET_COUNT_BY_CODE) {
        response = await this.getCountByCodeController(req, res);
      } else {
        throw new ErrorHandler({
          status_code: 400,
          message: 'route not available',
          message_code: 'WRONG_ROUTE',
        });
      }
      res.status(statusCode).send(response);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  private getAllEventsController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('getAllEventsController1', LogTypes.LOGS);
    const events = await this.getAllEventsService();
    // logger(events, LogTypes.LOGS);
    return {
      success: true,
      data: events,
      message_code: 'GET_ALL_EVENTS_SUCCESS',
      message: 'Events fetched successfully',
    };
  };

  private createEventController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('createEventController1', LogTypes.LOGS);
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
    logger('getEventController1', LogTypes.LOGS);
    // logger(req.params.code, LogTypes.LOGS);
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
    logger('deleteEventController1', LogTypes.LOGS);
    const event_code = req.params.code;
    const event = await this.deleteEventService(event_code);
    const data = 'no content';
    return {
      success: true,
      data,
      message_code: 'DELETE_EVENT_SUCCESS',
      message: 'Event deleted successfully',
    };
  };

  private registerController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('registerController1', LogTypes.LOGS);
    const userData: Partial<IEventUser> = req.body;
    const event = await this.registerService(userData);
    return {
      success: true,
      data: event,
      message_code: 'REGISTER_SUCCESS',
      message: 'User registered successfully',
    };
  };

  private unregisterController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('unregisterController1', LogTypes.LOGS);
    const userData: Partial<IEventUser> = req.body;
    const event = await this.unregisterService(userData);
    return {
      success: true,
      data: event,
      message_code: 'UNREGISTER_SUCCESS',
      message: 'User unregistered successfully',
    };
  };

  private getEventByClubController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('getEventByClubController1', LogTypes.LOGS);
    const club_name = req.params.club as string;
    if (!club_name) {
      throw new ErrorHandler({
        status_code: 400,
        message: 'Club name is required',
        message_code: 'CLUB_NAME_REQUIRED',
      });
    }
    const events = await this.getEventByClubService(club_name);
    return {
      success: true,
      data: events,
      message_code: 'GET_EVENT_BY_CLUB_SUCCESS',
      message: 'Events fetched successfully',
    };
  };

  private getAllUsersByCodeController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('getAllUsersByCodeController1', LogTypes.LOGS);
    const event_code = req.params.code;
    if (!event_code) {
      throw new ErrorHandler({
        status_code: 404,
        message: 'event code is required',
        message_code: 'EVENT_CODE_REQUIRED',
      });
    }
    const users = await this.getAllUsersByCodeService(event_code);
    return {
      success: true,
      data: users,
      message_code: 'GET_ALL_USERS_BY_CODE_SUCCESS',
      message: 'Users fetched successfully',
    };
  };
  private getCountByCodeController = async (req: Request, res: Response): Promise<IResponse> => {
    logger('getCountByCodeController1', LogTypes.LOGS);
    const event_code = req.params.code;
    const event = await this.getEventService(event_code);
    const count = event.reg_count;
    return {
      success: true,
      data: count,
      message_code: 'GET_COUNT_BY_CODE_SUCCESS',
      message: 'Count fetched successfully',
    };
  };
}
