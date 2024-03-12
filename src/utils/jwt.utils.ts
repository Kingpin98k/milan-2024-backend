import jwt from "jsonwebtoken";

export default class JWTUtils {
	PRIVATE_KEY: jwt.Secret;
	PUBLIC_KEY: jwt.Secret;

	constructor() {
		this.PRIVATE_KEY = process.env.JWT_SECRET as jwt.Secret;
		this.PUBLIC_KEY = process.env.JWT_SECRET_PUBLIC as jwt.Secret;
	}

	public generateTokens = async (
		userData: any,
		expires_in?: string,
		key?: string
	): Promise<{
		access_token: string;
		refresh_token: string;
	}> => {
		if (key) {
			this.PRIVATE_KEY = key;
		}
		const [access_token, refresh_token] = await Promise.all([
			this.generateAccessToken(userData, expires_in),
			this.generateRefreshToken(userData),
		]);

		return {
			access_token,
			refresh_token,
		};
	};

	private generateAccessToken = async (userData: any, expires_in?: string) => {
		const access_token = jwt.sign(
			{
				token: "access_token",
				data: userData,
			},
			this.PRIVATE_KEY,
			{
				expiresIn: expires_in ?? "15h",
				// algorithm: "RS256",
			}
		);
		return access_token;
	};

	private generateRefreshToken = async (userData: any) => {
		// const refresh_token = jwt.sign(
		// 	{
		// 		token: "refresh_token",
		// 		data: userData,
		// 	},
		// 	this.PRIVATE_KEY,
		// 	{
		// 		expiresIn: "24h",
		// 		// algorithm: "RS256",
		// 	}
		// );
		return "null";
	};
}
