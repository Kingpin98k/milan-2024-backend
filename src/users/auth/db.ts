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
		const query = `SELECT * FROM users WHERE	id = $1 AND is_deleted = false LIMIT 1;`;

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
			is_srm_ktr,
			gender,
			milan_id,
			phone_number,
			updated_at,
		} = reqObj;

		const query = `
    UPDATE users
    SET
      name = $1,
      email = $2,
      reg_number = $3,
      is_srm_ktr = $4,
      gender = $5,
      phone_number = $6,
      updated_at = $7,
			milan_id = $8,
      is_deleted = false
      WHERE id = $9
      RETURNING *`;

		const values = [
			name,
			email,
			reg_number,
			is_srm_ktr,
			gender,
			phone_number,
			updated_at,
			milan_id,
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
