import jwt from "jsonwebtoken";

export default class JWTUtils {
	PRIVATE_KEY: jwt.Secret;
	PUBLIC_KEY: jwt.Secret;

	constructor() {
		this.PRIVATE_KEY = process.env.JWT_SECRET as jwt.Secret;
		this.PUBLIC_KEY = process.env.JWT_SECRET_PUBLIC as jwt.Secret;
	}

	public generateTokens = async (
		userData: any
	): Promise<{
		access_token: string;
		refresh_token: string;
	}> => {
		const [access_token, refresh_token] = await Promise.all([
			this.generateAccessToken(userData),
			this.generateRefreshToken(userData),
		]);

		return {
			access_token,
			refresh_token,
		};
	};

	private generateAccessToken = async (userData: any) => {
		const access_token = jwt.sign(
			{
				token: "access_token",
				data: userData,
			},
			this.PRIVATE_KEY,
			{
				expiresIn: "15h",
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
