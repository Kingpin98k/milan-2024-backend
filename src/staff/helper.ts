import ErrorHandler from "../utils/errors.handler";
import StaffDB from "./db";
import bcrypt from "bcryptjs";
import {
	IStaffLoginRequestObject,
	IStaffPasswordChangeRequestObject,
	IStaffRegisterObject,
	IStaffResObject,
	StaffScope,
} from "./interface";
import logger, { LogTypes } from "../utils/logger";

export default class StaffHelper extends StaffDB {
	protected registerHelper = async (
		reqObj: IStaffRegisterObject
	): Promise<IStaffResObject> => {
		const user = await this.checkIsExistingStaff(reqObj.email);
		if (user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User already exists",
				message_code: "USER_ALREADY_EXISTS",
			});
		}

		const newReq = {
			...reqObj,
			password: await bcrypt.hash(reqObj.password, 10),
			created_at: new Date(),
			updated_at: new Date(),
		};

		const newUser = await this.registerStaff(newReq);

		return newUser;
	};

	protected loginHelper = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IStaffResObject> => {
		if (!reqObj.email || !reqObj.password) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Both Email and password are required",
				message_code: "EMAIL_PASSWORD_REQUIRED",
			});
		}
		const user = await this.checkIsExistingStaff(reqObj.email);
		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}
		if (user.role !== "admin" && user.is_verified === false) {
			throw new ErrorHandler({
				status_code: 403,
				message: "User not verified",
				message_code: "USER_NOT_VERIFIED",
			});
		}
		const match = await bcrypt.compare(reqObj.password, user.password);

		if (!match) {
			throw new ErrorHandler({
				status_code: 401,
				message: "Invalid password",
				message_code: "INVALID_PASSWORD",
			});
		}

		return user;
	};

	protected verifyHelper = async (id: string): Promise<IStaffResObject> => {
		// console.log(id);
		const user = await this.checkIsExistingStaffById(id);
		// console.log(user);
		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}

		const newUser = await this.verifyStaff(user.id);

		if (!newUser) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Something went wrong while verifying user",
				message_code: "SOMETHING_WENT_WRONG",
			});
		}

		return newUser;
	};

	protected denyHelper = async (id: string): Promise<IStaffResObject> => {
		const user = await this.checkIsExistingStaffById(id);

		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}

		const newUser = await this.denyStaff(user.id);

		if (!newUser) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Something went wrong while denying user",
				message_code: "SOMETHING_WENT_WRONG",
			});
		}

		return newUser;
	};

	protected changeStaffPasswordHelper = async (
		reqObj: IStaffPasswordChangeRequestObject
	): Promise<IStaffResObject> => {
		const user = await this.checkIsExistingStaff(reqObj.email);
		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}

		const newUser = await this.changeStaffPassword({
			...reqObj,
			password: await bcrypt.hash(reqObj.password, 10),
		});

		if (!newUser) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Something went wrong while changing password",
				message_code: "SOMETHING_WENT_WRONG",
			});
		}

		return newUser;
	};

	protected getStaffsHelper = async (
		type: StaffScope
	): Promise<IStaffResObject[]> => {
		const users = await this.getStaffs(type);
		if (!users) {
			throw new ErrorHandler({
				status_code: 404,
				message: "No users found",
				message_code: "NO_USERS_FOUND",
			});
		}
		return users;
	};

	protected deleteHelper = async (id: string): Promise<void> => {
		const user = await this.checkIsExistingStaffById(id);

		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}

		await this.deleteStaff(user.id);
		return;
	};

	protected getStaffHelper = async (id: string): Promise<IStaffResObject> => {
		const user = await this.getStaff(id);

		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}

		return user;
	};
}
