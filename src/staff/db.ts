import {
	IStaffLoginRequestObject,
	IStaffPasswordChangeRequestObject,
	IStaffRegisterObject,
	IStaffResObject,
	StaffScope,
} from "./interface";
import db from "../config/pg.config";
import logger, { LogTypes } from "../utils/logger";
import { IUpdateTicketReqObj } from "../users/bookings/interface";
import { IUser } from "../events/interface";

export default class StaffDB {
	protected getStaffs = async (
		type: StaffScope
	): Promise<IStaffResObject[]> => {
		const query = `SELECT * FROM staffs WHERE role = $1`;
		const res = await db.query(query, [type]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows as unknown as IStaffResObject[];
		}
	};

	protected getStaff = async (id: string): Promise<IStaffResObject> => {
		const query = `SELECT * FROM staffs WHERE id = $1`;
		const res = await db.query(query, [id]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected getUserByUserID = async (id: string): Promise<IUser> => {
		logger('getUserByUserIDdb', LogTypes.LOGS);
		const query = `SELECT * FROM users WHERE id = $1`;
		const res = await db.query(query, [id]);
		logger(res, LogTypes.LOGS);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IUser;
		}
	};

	protected getUserIdByEmail = async (
		email: string
	): Promise<IStaffResObject> => {
		const query = `SELECT * FROM users WHERE email = $1 AND is_deleted = false LIMIT 1`;
		const res = await db.query(query, [email]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected getBookingByEmail = async (email: string): Promise<any> => {
		const query = `SELECT * 
		FROM bookings 
		WHERE user_id = (SELECT id FROM users WHERE email = $1) 
		AND payment_status = 'success' 
		AND ticket_status = 'success';
		
		`;
		const res = await db.query(query, [email]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows as unknown as any;
		}
	};

	protected getOfflineTicketsIssued = async (): Promise<any> => {
		const query = `SELECT 
    json_build_object(
        'ticket_1', COUNT(DISTINCT CASE WHEN ticket_type = '1' THEN user_id END),
        'ticket_2', COUNT(DISTINCT CASE WHEN ticket_type = '2' THEN user_id END),
        'ticket_3', COUNT(DISTINCT CASE WHEN ticket_type = '3' THEN user_id END)
    ) AS ticket_counts
		FROM bookings
		WHERE 
				ticket_status = 'success' 
				AND offline_ticket_issued = true 
				AND payment_status = 'success';
`;

		const res = await db.query(query);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as any;
	};

	protected getTotalTicketsSold = async (): Promise<any> => {
		const query = `SELECT 
    json_build_object(
        'ticket_1', COUNT(DISTINCT CASE WHEN ticket_type = '1' THEN user_id END),
        'ticket_2', COUNT(DISTINCT CASE WHEN ticket_type = '2' THEN user_id END),
        'ticket_3', COUNT(DISTINCT CASE WHEN ticket_type = '3' THEN user_id END)
    ) AS ticket_counts
		FROM bookings
		WHERE 
				ticket_status = 'success' 
				AND payment_status = 'success';`;

		const res = await db.query(query);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as any;
	};

	protected changeStaffPassword = async (
		reqObj: IStaffPasswordChangeRequestObject
	): Promise<IStaffResObject> => {
		const query = `UPDATE staffs SET password = $1 , is_verified = false WHERE email = $2 RETURNING *`;
		const res = await db.query(query, [reqObj.password, reqObj.email]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected deleteUser = async (id: string): Promise<void> => {
		const query = `delete from users WHERE is_ticket_issued = false AND is_registration_ticket_issued = false AND id = $1`;
		const res = await db.query(query, [id]);
		if (res instanceof Error) {
			throw res;
		}
	};

	protected getTotalRegistrations = async (): Promise<any> => {
		const query = `SELECT COUNT(*) FROM users WHERE is_deleted = false;`;
		const res = await db.query(query);
		if (res instanceof Error) {
			throw res;
		}
		return res.rows[0] as unknown as any;
	};

	protected registerStaff = async (
		reqObj: IStaffRegisterObject
	): Promise<IStaffResObject> => {
		const query = db.format(`INSERT INTO staffs ? RETURNING *`, reqObj);
		const res = await db.query(query);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected checkIsExistingStaff = async (
		email: string
	): Promise<IStaffResObject> => {
		const query = `SELECT * FROM staffs WHERE email = $1 LIMIT 1`;
		const res = await db.query(query, [email]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected checkIsExistingStaffById = async (
		id: string
	): Promise<IStaffResObject> => {
		const query = `SELECT * FROM staffs WHERE id = $1 LIMIT 1`;
		const res = await db.query(query, [id]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected verifyStaff = async (id: string): Promise<IStaffResObject> => {
		const query = `UPDATE staffs SET is_verified = true WHERE id = $1 RETURNING *`;
		const res = await db.query(query, [id]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected denyStaff = async (id: string): Promise<IStaffResObject> => {
		const query = `UPDATE staffs SET is_verified = false WHERE id = $1 RETURNING *`;
		const res = await db.query(query, [id]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
	};

	protected deleteStaff = async (id: string): Promise<any> => {
		const query = `
        WITH deleted AS (
            DELETE FROM staffs WHERE id = $1 RETURNING *
        )
        SELECT CASE
            WHEN EXISTS (SELECT 1 FROM deleted) THEN 'USER_DELETED'
            ELSE 'USER_NOT_FOUND'
        END as result;
    `;

		const res = await db.query(query, [id]);

		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as any; // Accessing the result by its column alias 'result'
		}
	};
}
