import db from "../../config/pg.config";
import { IUserAuthResObject, IUserAuthSignupReqObj } from "./interface";

export default class UsersAuthDB {
	protected getUserByEmail = async (
		email: string
	): Promise<IUserAuthResObject> => {
		const query = `SELECT * FROM users WHERE email = $1 AND is_deleted = false LIMIT 1`;

		const res = await db.query(query, [email]);

		if (res instanceof Error) {
			throw res;
		}

		return res.rows[0] as unknown as IUserAuthResObject;
	};

	protected getUser = async (id: string): Promise<IUserAuthResObject> => {
		const query = `SELECT 
		u.*, 
		CASE 
			WHEN b.ticket_status = 'success' 
				THEN json_build_object(
					'payment_id', b.payment_id, 
					'ticket_id', b.ticket_id, 
					'payment_status', b.payment_status, 
					'ticket_status', b.ticket_status, 
					'offline_ticket_issued', b.offline_ticket_issued
				)
			ELSE 
				json_build_object(
					'payment_id', NULL, 
					'ticket_id', NULL, 
					'payment_status', NULL, 
					'ticket_status', NULL, 
					'offline_ticket_issued', NULL
				)
					END AS booking_info
					FROM 
							users u
					LEFT JOIN 
							bookings b ON u.id = b.user_id AND b.ticket_status = 'success'
					WHERE 
							u.id = $1 AND 
							u.is_deleted = false
					LIMIT 1;
	`;

		const res = await db.query(query, [id]);

		if (res instanceof Error) {
			throw res;
		}

		return res.rows[0] as unknown as IUserAuthResObject;
	};

	protected createUser = async (
		reqObj: IUserAuthSignupReqObj
	): Promise<IUserAuthResObject> => {
		const query = db.format(`INSERT INTO users ? RETURNING *`, reqObj);
		const res = await db.query(query);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IUserAuthResObject;
		}
	};

	protected reviveUser = async (
		id: string,
		reqObj: IUserAuthSignupReqObj
	): Promise<IUserAuthResObject> => {
		const {
			name,
			email,
			reg_number,
			is_srm_student,
			phone_number,
			updated_at,
		} = reqObj;

		const query = `
    UPDATE users
    SET
      name = $1,
      email = $2,
      password = $3,
      reg_number = $4,
      is_ktr_student = $5,
      phone_number = $6,
      updated_at = $7,
      is_deleted = false
      WHERE id = $8
      RETURNING *`;

		const values = [
			name,
			email,
			reg_number,
			is_srm_student,
			phone_number,
			updated_at,
			id,
		];

		const res = await db.query(query, values);

		if (res instanceof Error) {
			throw res;
		}

		return res.rows[0] as unknown as IUserAuthResObject;
	};

	protected isExistingUser = async (
		email: string,
		phone_number: number,
		reg_number: string
	): Promise<IUserAuthResObject> => {
		const query = `SELECT is_deleted, id FROM users WHERE email = $1 OR phone_number = $2 OR reg_number = $3 LIMIT 1`;

		const res = await db.query(query, [email, phone_number, reg_number]);

		if (res instanceof Error) {
			throw res;
		}

		return res.rows[0] as unknown as IUserAuthResObject;
	};

	protected deleteUser = async (user_id: string): Promise<void> => {
		const query = `UPDATE users SET is_deleted = true WHERE id = $1`;

		await db.query(query, [user_id]);
	};
}

export class ExtendedUserServiceDb extends UsersAuthDB {
	getUser_Email = async (email: string): Promise<IUserAuthResObject> => {
		return await this.getUserByEmail(email);
	};
}
