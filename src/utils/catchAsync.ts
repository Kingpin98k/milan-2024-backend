/*eslint-disable*/
//This is the error-handler for asyncFunctions
// fn-> the async function passed by the handler that will get executed and will return a function reference that

import { NextFunction, Request, Response } from "express";

// will be executed by express and if any error occurs will then be handled by globalErrorHandler
export const catchAsync = (fn: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch((err: Error) => {
			next(err);
		});
	};
};
