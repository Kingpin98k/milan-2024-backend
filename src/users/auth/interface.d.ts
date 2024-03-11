export type IUserAuthLoginReqObj = {
	email: string;
	password: string;
};

export type IResponse<T = any> = {
	success: boolean;
	message?: string;
	data?: T | null;
	message_code?: string;
};

export type IUserAuthSignupReqObj = {
	id: string;
	name: string;
	email: string;
	password: string;
	reg_number: string;
	college: string;
	is_srm_ktr: boolean;
	gender: string;
	milan_id: string;
	phone_number: number;
	updated_at: Date;
	created_at: Date;
};

export type IUserAuthResObject = {
	id: string;
	name: string;
	email: string;
	reg_number: string;
	is_srm_ktr: boolean;
	gender: string;
	phone_number: number;
	college: string;
	milna_id: string;
	is_ticket_issued: boolean;
	is_deleted: boolean;
	updated_at: Date;
	created_at: Date;
};
export type IResponse<T = any> = {
	success: boolean;
	message?: string;
	data?: T | null;
	message_code?: string;
};

export type IAuthResponse = {
	user: IResponse; //error
	token?: string;
};

export type AuthObj = {
	user: IUserAuthResObject; //error
	token?: string;
};

declare namespace Express {
	interface Request {
		user?: any; // or replace 'any' with the type of your user object
	}
}
