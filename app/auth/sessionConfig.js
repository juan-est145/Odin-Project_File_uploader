const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const prisma = new PrismaClient();

const timeCalc = {
	msToSeconds : 1000,
	secndsToMinutes : 60,
	minToHours : 60,
	hoursToDays: 24,
};

const maxAge = Object.values(timeCalc).reduce((prev, curr) => {
	return prev * curr;
}) * 12;

const sessionConfig = session({
	store: new PrismaSessionStore(
		prisma, {
			checkPeriod: maxAge,
			dbRecordIdFunction: true,
			dbRecordIdFunction: undefined,
		}
	),
	resave: false,
	saveUninitialized: false,
	secret: process.env.SECRET,
	cookie : { maxAge: maxAge },
});

module.exports = {
	prisma,
	sessionConfig,
};