const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs");
const queries = require("#db/queries.js");

const customFields = {
	usernameField: "userName",
	passwordField: "pswd",
};

const strategy = new LocalStrategy((customFields, async (username, password, done) => {
	try {
		const user = await queries.getUser({ username: username });
		const passMatch = await bcrypt.compare(password, user.password);
		if (!passMatch)
			return done(null, false, { message: "Invalid username or password"});
		return done(null, user);
	} catch (error) {
		console.error(error);
		return done(error);
	}
}));