export default class ErrorHandler extends Error {
	status_code: number;
	message: string;
	data: any;
	message_code: string;
	status: string;
	is_loggable?: boolean;
	user?: any;

	constructor(errorObj: {
		status_code: number;
		message: string;
		data?: any;
		message_code: string;
		is_loggable?: boolean;
		user?: any;
	}) {
		super(errorObj.message);
		this.status_code = errorObj.status_code;
		this.message = errorObj.message;
		this.status = `${errorObj.status_code}`.startsWith("4") ? `fail` : `error`;
		this.data = errorObj.data;
		this.message_code = errorObj.message_code;
		this.is_loggable = errorObj.is_loggable;
		this.user = errorObj.user;
		// Capture the error's stack trace, excluding this constructor.
		// Simplifies error messages to show only relevant code for easier debugging.
		Error.captureStackTrace(this, this.constructor);
	}

	toString() {
		return {
			message: this.message,
			status_code: this.status_code,
			status: this.status,
			data: this.data,
			message_code: this.message_code,
			is_loggable: this.is_loggable,
		};
	}
}
