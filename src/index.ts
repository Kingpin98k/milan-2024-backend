import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
// import hpp from "hpp";
import "dotenv/config";
import helmet from "helmet";
import moment from "moment";
import logger, { LogTypes } from "./utils/logger";
import bodyParser from "body-parser";
import ErrorHandler from "./utils/errors.handler";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
const app: Application = express();
const port = process.env.PORT || 5000;
//Security
// app.use(hpp());
app.use(helmet());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"https://srmmilan.org",
			"https://www.srmmilan.org",
			"https://admin.srmmilan.org",
			"https://frontend-deploy.d21g3rd3fhuqgv.amplifyapp.com",
			"https://deployed.dbtuyvk3p4wbw.amplifyapp.com",
			"https://dev9501.d1rexfnjrhb8nq.amplifyapp.com",
			"https://ankit-dev.dbtuyvk3p4wbw.amplifyapp.com",
		],
		credentials: true,
	})
);

app.use(
	cookieSession({
		name: "session",
		keys: ["milan-auth"],
		maxAge: 24 * 60 * 60 * 1000, // 5 seconds
	})
);

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//---------------------------------------------------------------
//Routes
import userRoutes from "./users/auth/routes";
import eventsRoutes from "./events/routes";
import staffRoutes from "./staff/routes";
import teamsRoutes from "./teams/routes";
import bookingRoutes from "./users/bookings/routes";

app.use("/api/events", eventsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

//---------------------------------------------------------------
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
app.use(
	(err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
		const { status_code, message, message_code } = err;
		res.status(status_code || 500).json({
			error: {
				message: message || "Internal Server Error",
				message_code: message_code || "INTERNAL_SERVER_ERROR",
			},
		});
	}
);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	next(
		new ErrorHandler({
			status_code: 404,
			message: "Route not found",
			message_code: "ROUTE_NOT_FOUND",
		})
	);
});

app.use(
	(err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
		const { status_code, message, message_code } = err;
		res.status(status_code || 500).json({
			error: {
				message: message || "Internal Server Error",
				message_code: message_code || "INTERNAL_SERVER_ERROR",
			},
		});
	}
);

app.listen(process.env.PORT, () => {
	logger(`Server is running on port ${port}`, LogTypes.LOGS);
});
