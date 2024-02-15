export type StaffScope = "admin" | "convenor" | "scanner" | "viewer";

export type IStaffRegisterObject = {
	name: string;
	email: string;
	password: string;
	reg_number: string;
	phone_number: number;
	is_verified: boolean;
	club_name: string;
	role: StaffScope;
};

export type IStaffPasswordChangeRequestObject = {
	email: string;
	password: string;
};

export type IStaffResObject = {
	id: string;
	name: string;
	email: string;
	reg_number: string;
	phone_number: number;
	is_verified: boolean;
	password: string;
	club_name: string;
	role: StaffScope;
	created_at: Date;
	updated_at: Date;
	is_deleted: boolean;
};

export type IStaffAuthResObject = {
	user: IStaffResObject;
	token?: string;
};

export type IStaffLoginRequestObject = {
	email: string;
	password: string;
};

export type IStaffUpdateObject = {
	name: string;
	email: string;
	reg_number: string;
	phone_number: number;
	club_name: string;
	role: StaffScope;
};
