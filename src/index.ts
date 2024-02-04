import * as dotenv from 'dotenv';
dotenv.config();
<<<<<<< HEAD
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger, { LogTypes } from './utils/logger';
import bodyParser from 'body-parser';
import ErrorHandler from './utils/errors.handler';
import { globalErrorHandler } from './utils/errorController';
import cookieSession from 'cookie-session';
import passport from 'passport';
import './utils/passport';
=======
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import logger, { LogTypes } from "./utils/logger";
import bodyParser from "body-parser";
import ErrorHandler from "./utils/errors.handler";
import cookieSession from "cookie-session";
import passport from "passport";
import "./users/auth/passport";
>>>>>>> 671426e54be0c37e3c3a0cb075124110e981f31a

const app: Application = express();

//Passport Config
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

app.use(
<<<<<<< HEAD
  cookieSession({
    name: 'session',
    keys: ['milan-auth'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
=======
	cookieSession({
		name: "session",
		keys: ["milan-auth"],
		maxAge: 24 * 60 * 60 * 1000, // 5 seconds
	})
>>>>>>> 671426e54be0c37e3c3a0cb075124110e981f31a
);

app.use(passport.initialize());
app.use(passport.session());

//Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//---------------------------------------------------------------
//Routes

<<<<<<< HEAD
import authRoutes from "./users/auth/routes";
import moment from "moment";

app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	res.status(200).send({
		message: "Server is running",
		status_code: 200,
		entry_time: date,
	});
});
app.get("/health", (req: Request, res: Response) => {
	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	res.status(200).send({
		message: "Server is running",
		status_code: 200,
		entry_time: date,
	});
});

=======
import authRoutes from './users/auth/routes';
import eventsRoutes from './events/routes';

app.use('/events', eventsRoutes);
logger('Events routes loaded', LogTypes.LOGS);
app.use('/auth', authRoutes);
>>>>>>> 02a872857479b279a75f61b1f703c893aa4a6d38
//---------------------------------------------------------------
<<<<<<< HEAD

//Error Handler
app.use(globalErrorHandler);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  console.log(`Request URL: ${req.url}`);
  next(
    new ErrorHandler({
      status_code: 404,
      message: 'Route not found',
      message_code: 'ROUTE_NOT_FOUND',
    })
  );
=======
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	next(
		new ErrorHandler({
			status_code: 404,
			message: "Route not found",
			message_code: "ROUTE_NOT_FOUND",
		})
	);
>>>>>>> 671426e54be0c37e3c3a0cb075124110e981f31a
});

app.listen(process.env.PORT, () => {
  logger(`Server is running on port ${process.env.PORT ?? 5000}`, LogTypes.LOGS);
});
