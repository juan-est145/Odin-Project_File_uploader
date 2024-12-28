const { prisma } = require("#auth/sessionConfig.js");

async function getUser(conditions) {
	try {
		const user = await prisma.user.findUnique({ where: conditions })
		return (user);
	} catch (error) {
		throw error;
	}
}

async function postUser(conditions) {
	try {
		const user = await prisma.user.create({
			data: conditions,
		});
		return (user);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getUser,
	postUser,
}