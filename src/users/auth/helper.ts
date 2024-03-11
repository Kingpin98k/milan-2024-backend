import { IUserAuthResObject, IUserAuthSignupReqObj } from "./interface";
import ErrorHandler from "../../utils/errors.handler";
import UsersAuthDB from "./db";
import uniqid from "uniqid";

export default class UsersAuthHelper extends UsersAuthDB {
	protected getUserByEmailHelper = async (
		email: string
	): Promise<IUserAuthResObject> => {
		const user = await this.getUserByEmail(email);

		if (!user) {
			throw new ErrorHandler({
				status_code: 404,
				message: "User not found",
				message_code: "USER_NOT_FOUND",
			});
		}

		return user;
	};

	protected signupUserHelper = async (
		reqObj: IUserAuthSignupReqObj
	): Promise<IUserAuthResObject> => {
		const isExistingUser = await this.isExistingUser(
			reqObj.email,
			reqObj.phone_number,
			reqObj.reg_number
		);

		if (isExistingUser) {
			if (isExistingUser.is_deleted) {
				const milan_id = uniqid("MILAN-");
				const user = await this.reviveUser(isExistingUser.id, {
					...reqObj,
					milan_id: milan_id,
					created_at: new Date(),
					updated_at: new Date(),
				});
				return user;
			} else {
				throw new ErrorHandler({
					status_code: 404,
					message: "User already exists",
					message_code: "USER_ALREADY_EXISTS",
				});
			}
		}

		const milan_id = uniqid("MILAN-");
		const user = await this.createUser({
			...reqObj,
			milan_id: milan_id,
			created_at: new Date(),
			updated_at: new Date(),
		});

		if (!user) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Something went wrong while creating user",
				message_code: "SOMETHING_WENT_WRONG",
			});
		}

		return user;
	};

	protected getUserHelper = async (id: string): Promise<IUserAuthResObject> => {
		const user = await this.getUser(id);
		return user;
	};

	protected deleteUserHelper = async (user_id: string): Promise<void> => {
		await this.deleteUser(user_id);
		return;
	};
}
