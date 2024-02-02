import * as OAuth from "passport-google-oauth20";
import passport from "passport";

const GoogleStartegy = OAuth.Strategy;

passport.use(
	new GoogleStartegy(
		{
			clientID: process.env.CLIENT_ID || "",
			clientSecret: process.env.CLIENT_SECRET || "",
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(profile);
			cb(null, profile);
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
