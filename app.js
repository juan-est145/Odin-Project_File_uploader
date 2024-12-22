const { PrismaClient } = require("@prisma/client");
const express = require("express");

const app = express();
const prisma = new PrismaClient();

async function main() {
	// Run only once
	// await prisma.user.create({
	// 	data: {
	// 		name: "Alice",
	// 		email: "alice@prisma.io",
	// 		posts: {
	// 			create: { title: "Hello World" },
	// 		},
	// 		profile: {
	// 			create: { "bio": "I like turtles" },
	// 		},
	// 	},
	// });

	// const allUsers = await prisma.user.findMany({
	// 	include: {
	// 		posts: true,
	// 		profile: true,
	// 	}
	// });
	// console.dir(allUsers, { depth: null });
	const post = await prisma.post.update({
		where: { id: 1 },
		data: { published: true },
	});
	console.log(post);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async(e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});