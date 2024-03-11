import { IUser } from "../events/interface";
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

	protected verifyService = async (id: string): Promise<IStaffResObject> => {
		const response = await this.verifyHelper(id);
		return response;
	};

	protected changePasswordService = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IStaffResObject> => {
		const response = await this.changeStaffPasswordHelper(reqObj);
		return response;
	};

	protected denyService = async (id: string): Promise<IStaffResObject> => {
		const response = await this.denyHelper(id);
		return response;
	};

	protected deleteService = async (id: string): Promise<void> => {
		await this.deleteHelper(id);
	};

	protected getStaffService = async (
		id: string
	): Promise<IStaffAuthResObject> => {
		const user = await this.getStaffHelper(id);
		const response = {
			user,
			token: "",
		};

		return response;
	};

	protected getUserByUserIDService = async (
		id: string
	): Promise<IUser> => {
		logger('GetUserByUserIDService', LogTypes.LOGS);
		const response = await this.getUserByUserIDHelper(id);
		logger(response, LogTypes.LOGS);
		return response;
	};

	protected getUserIdByEmailService = async (
		email: string
	): Promise<IStaffResObject> => {
		const user = await this.getUserIdByEmailHelper(email);
		return user;
	};

	protected getBookingByEmailService = async (email: string): Promise<any> => {
		const response = await this.getBookingByEmailHelper(email);
		return response;
	};

	protected getOfflineTicketsIssuedService = async (): Promise<any> => {
		const response = await this.getOfflineTicketsIssuedHelper();
		return response;
	};

	protected getTotalRegistrationsServsice = async (): Promise<any> => {
		const response = await this.getTotalRegistrationsHelper();
		return response;
	};

	protected getTotalTicketsSoldService = async (): Promise<any> => {
		const response = await this.getTotalTicketsSoldHelper();
		return response;
	};

	protected deleteUserService = async (id: string): Promise<void> => {
		await this.deleteUserHelper(id);
	};
}
