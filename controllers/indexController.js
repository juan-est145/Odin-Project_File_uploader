const { body, validationResult } = require("express-validator");
const { passportAuth } = require("#auth/passport.js");
const bcrypt = require("bcryptjs");
const queries = require("#db/queries.js");

const minPswdLength = 8;

function getIndex(req, res) {
	if (req.isAuthenticated())
		return (res.redirect("/storage"));
	res.render("index");
}

function getSignUp(req, res) {
	if (req.isAuthenticated())
		return (res.redirect("/storage"));
	res.render("signUp");
}

function getLogOut(req, res, next) {
	req.logout(async (err) => {
		if (err)
			return next(err);
		await req.session.destroy((err) => {
			if (err)
				return next(err);
		});
			return res.redirect("/");
	});
}

const postSignUp = [
	[
		body("username").trim()
			.isLength({ min: 1, max: 255 }).withMessage("Username must have between 1 and 255 characters"),
		body("password").trim()
			.isLength({ min: minPswdLength, max: 255 }).withMessage("Password must have between 8 and 255 characters"),
		body("repeatPassword").trim()
			.custom((value, { req }) => {
				if (value !== req.body.password)
					throw new Error("Passwords do not match");
				return (true);
			}),
	],
	async function signUp(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("valErrors", errors.array());
			return res.status(400).redirect("/sign-up");
		}
		try {
			const hash = await bcrypt.hash(req.body.password, 10);
			await queries.postUser({ username: req.body.username, password: hash })
			return passportAuth(req, res, next);
		} catch (error) {
			if (error.code === "P2002") {
				req.flash("valErrors", [{msg: "Username already exists"}]);
				return res.status(400).redirect("/sign-up");
			}
			console.error(error);
			next(error);
		}
	}
];

const postLogIn = [
	[
		body("username").trim()
			.isLength({ min: 1, max: 255 }).withMessage("Invalid username or password"),
		body("password").trim()
			.isLength({ min: minPswdLength, max: 255 }).withMessage("Invalid username or password"),
	],
	async function logIn(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash("valErrors", errors.array()[0]);
				return res.status(400).redirect("/");
			}
			return passportAuth(req, res, next);
		} catch (error) {
			console.error(error);
			next(error);
		}
	}
];

module.exports = {
	getIndex,
	getSignUp,
	getLogOut,
	postSignUp,
	postLogIn,
};