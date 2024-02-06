import {
	IStaffLoginRequestObject,
	IStaffPasswordChangeRequestObject,
	IStaffRegisterObject,
	IStaffResObject,
	StaffScope,
} from "./interface";
import db from "../config/pg.config";
import logger, { LogTypes } from "../utils/logger";

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

	protected changeStaffPassword = async (
		reqObj: IStaffPasswordChangeRequestObject
	): Promise<IStaffResObject> => {
		const query = `UPDATE staffs SET password = $1 WHERE email = $2 RETURNING *`;
		const res = await db.query(query, [reqObj.password, reqObj.email]);
		if (res instanceof Error) {
			throw res;
		} else {
			return res.rows[0] as unknown as IStaffResObject;
		}
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

	protected deleteStaff = async (id: string): Promise<void> => {
		const query = `DELETE FROM staffs WHERE id = $1`;
		const res = await db.query(query, [id]);
		if (res instanceof Error) {
			throw res;
		} else {
			return;
		}
	};
}
