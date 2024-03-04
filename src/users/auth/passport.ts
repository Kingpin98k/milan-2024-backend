import * as OAuth from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const GoogleStartegy = OAuth.Strategy;

passport.use(
	new GoogleStartegy(
		{
			clientID: process.env.CLIENT_ID || "",
			clientSecret: process.env.CLIENT_SECRET || "",
			callbackURL: "/users/auth/google/callback",
			scope: ["profile", "email"],
		},
		async (accessToken, refreshToken, profile, cb) => {
			const defaultUser = {
				fullName: `${profile.name?.givenName} ${profile.name?.familyName}`,
				email: profile.emails?.[0].value,
				profilePic: profile.photos?.[0].value,
				googleId: profile.id,
			};
			cb(null, defaultUser);
		}
	)
);

//We are using cookie sessions so we need to serialize user and deserialize user

//Serialize user
passport.serializeUser((user, cb) => {
	cb(null, user);
});

//Deserialize user
passport.deserializeUser((user, cb) => {
	cb(null, user as any);
});
