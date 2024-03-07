export type ITeamCreateReqObject = {
	team_name: string;
	user_id: string;
	event_code: string;
	user_count?: number;
};

export type ITeamResObject = {
	id: string;
	team_name: string;
	event_code: string;
	team_code: string;
	event_id: string;
	created_at: Date;
	updated_at: Date;
};

export type ITeamMemberAddReqObject = {
	id: string;
	user_id: string;
	is_captain?: boolean;
	team_id: string;
	event_code: string;
	team_code: string;
	created_at: Date;
	updated_at: Date;
};

export type ITeamJoinReqObject = {
	team_code: string;
	user_id: string;
};

export type ITeamUpdateNameReqObject = {
	team_code: string;
	team_name: string;
	user_id: string;
};

export type ITeamDeleteReqObject = {
	team_code: string;
	user_id: string;
};

export type ITeamLeaveReqObject = {
	team_code: string;
	user_id: string;
};

export type IUserTeamForEventReqObject = {
	user_id: string;
	event_code: string;
};

export type ITeamDeleteMemberReqObject = {
	captain_id: string;
	member_id: string;
	team_code: string;
};
