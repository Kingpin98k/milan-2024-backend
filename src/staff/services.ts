import JWTUtils from "../utils/jwt.utils";
import logger, { LogTypes } from "../utils/logger";
import StaffHelper from "./helper";
import {
	IStaffAuthResObject,
	IStaffLoginRequestObject,
	IStaffRegisterObject,
	IStaffResObject,
	StaffScope,
} from "./interface";
import IStaffValidation from "./middleware";

export default class StaffService extends StaffHelper {
	jwtHelper: JWTUtils;
	constructor() {
		super();
		this.jwtHelper = new JWTUtils();
	}
	protected getStaffsService = async (
		type: StaffScope
	): Promise<IStaffResObject[]> => {
		const response = await this.getStaffsHelper(type);
		return response;
	};

	protected registerService = async (
		reqObj: IStaffRegisterObject
	): Promise<IStaffAuthResObject> => {
		IStaffValidation.validateEmailAndPhone(reqObj.email, reqObj.phone_number);

		const user = await this.registerHelper(reqObj);
		const token = await this.jwtHelper.generateTokens(user);
		const response: IStaffAuthResObject = {
			user,
			token: token.access_token,
		};

		return response;
	};

	protected loginService = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IStaffAuthResObject> => {
		const user = await this.loginHelper(reqObj);

		const token = await this.jwtHelper.generateTokens(user);

		const response: IStaffAuthResObject = {
			user,
			token: token.access_token,
		};

		return response;
	};

	protected verifyService = async (email: string): Promise<IStaffResObject> => {
		const response = await this.verifyHelper(email);
		return response;
	};

	protected changePasswordService = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IStaffResObject> => {
		const response = await this.changeStaffPasswordHelper(reqObj);
		return response;
	};

	protected denyService = async (email: string): Promise<IStaffResObject> => {
		const response = await this.denyHelper(email);
		return response;
	};

	protected deleteService = async (id: string): Promise<void> => {
		await this.deleteHelper(id);
	};
}
