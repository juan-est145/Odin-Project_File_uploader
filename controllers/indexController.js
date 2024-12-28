const { body, validationResult } = require("express-validator");
const { passportAuth } = require("#auth/passport.js");
const bcrypt = require("bcryptjs");

const minPswdLength = 8;

function getIndex(req, res) {
	res.render("index");
}

function getSignUp(req, res) {
	res.render("signUp");
}

const postSignIn = [
	[
		body("username").trim()
			.isLength({ min: 1, max: 255 }).withMessage("Invalid username or password"),
		body("password").trim()
			.isLength({ min: minPswdLength, max: 255 }).withMessage("Invalid username or password"),
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
			//Might need to use later req.flash
			return res.status(400).redirect("/sign-up")
		}
		try {
			const hash = await bcrypt.hash(req.body.password, 10);
			// Implement sign up function
			return passportAuth(req, res, next);
		} catch (error) {
			console.error(error);
			//Implement sign up error handle
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
				// Might need to use later req.flash
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
	postSignIn,
	postLogIn,
};