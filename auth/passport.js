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
		const user = await queries.getUser({username: username});
		const passMatch = await bcrypt.compare(password, user.password);
		if (!passMatch)
			return done(null, false, { message: "Invalid username or password"});
		return done(null, user);
	} catch (error) {
		console.error(error);
		return done(error);
	}
}));

passport.use(strategy);
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	try {
		done(null, await queries.getUser({id: id}));
	} catch (error) {
		done(error);
	}
});
const passportConf = passport.session();
const passportAuth = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err)
			return next(err);
		if (!user)
			return res.redirect("/");
		req.logIn(user, (err) => {
			if (err)
				return next(err);
			return res.redirect("/storage");
		});
	})(req, res, next);
};

module.exports = {
	passportConf,
	passportAuth,
};