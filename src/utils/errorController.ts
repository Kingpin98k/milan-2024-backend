import { NextFunction, Request, Response } from "express";
import logger, { LogTypes } from "./logger";
import ErrorHandler from "./errors.handler";
import { disc_error_logger } from "./disc_logger";

export const globalErrorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	error.status_code = error.status_code || 500;
	error.status = error.status || "error";

	if (error?.is_loggable) {
		disc_error_logger.error({
			message: `${error.message_code}`,
			description: `
			# Error Details
			
			### Message : 
			${error.message}
			
			### User : 
			${error.user ?? ""}
			
			### Timestamp : 
			${new Date().toLocaleString()}
			`,
			error: error, // This field can be included in other log functions as well
		});
	}

	logger(
		`Request failed with: ${
			error ? error.message ?? JSON.stringify(error) : "No error"
		}`,
		LogTypes.CUSTOM_OBJ
	);

	if (error instanceof ErrorHandler) {
		res.status(error.status_code).send({
			success: false,
			status: error.status,
			message: error.message,
			data: error.data,
			message_code: error.message_code,
		});
	}

	res.status(500).send({
		success: false,
		status: "error",
		message: "Hold Tight! Our Engineers Are on the Case",
	});
};
