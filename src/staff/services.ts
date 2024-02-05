import StaffHelper from "./helper";
import {
	IStaffLoginRequestObject,
	IStaffRegisterObject,
	IStaffResObject,
	StaffScope,
} from "./interface";

export default class StaffService extends StaffHelper {
	protected getStaffsService = async (
		type: StaffScope
	): Promise<IStaffResObject[]> => {
		const response = await this.getStaffsHelper(type);
		return response;
	};

	protected registerService = async (
		reqObj: IStaffRegisterObject
	): Promise<IStaffResObject> => {
		const response = await this.registerHelper(reqObj);
		return response;
	};

	protected loginService = async (
		reqObj: IStaffLoginRequestObject
	): Promise<IStaffResObject> => {
		const response = await this.loginHelper(reqObj);
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
