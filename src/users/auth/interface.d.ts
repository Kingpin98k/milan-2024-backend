export type IUserAuthLoginReqObj = {
	email: string;
	password: string;
};

export type IUserAuthSignupReqObj = {
	id: string;
	name: string;
	email: string;
	reg_number: string;
	is_srm_student: boolean;
	profile_pic: string;
	college_name: string;
	phone_number: number;
	updated_at: Date;
	created_at: Date;
};

export type IUserAuthResObject = {
	id: string;
	name: string;
	email: string;
	reg_number: string;
	is_srm_student: boolean;
	profile_pic: string;
	college_name: string;
	phone_number: number;
	is_ticket_issued: boolean;
	is_in_team: boolean;
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

export type AuthObj = {
	user: IUserAuthResObject; //error
	token?: string;
};

declare namespace Express {
	interface Request {
		user?: any; // or replace 'any' with the type of your user object
	}
}
