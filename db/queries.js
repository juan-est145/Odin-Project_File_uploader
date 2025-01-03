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

async function getFolderId(folderId, user) {
	try {
		const folder = await prisma.folder.findFirst({
			where: {
				userId: {
					equals: user
				},
				AND: {
					id: {
						equals: folderId
					}
				}
			}
		});
		if (folder)
			return (folder);
		const home = await prisma.folder.findFirstOrThrow({
			where: {
				userId: {
					equals: user
				},
				AND: {
					parentId: {
						equals: null
					}
				}
			}
		});
		return (home);
	} catch (error) {
		throw error;
	}
}

async function getAllChild(folder) {
	try {
		const folders = await prisma.folder.findMany({
			where: {
				parentId: {
					equals: folder.id
				}
			},
		});
		const files = await prisma.file.findMany({
			where: {
				folderId: {
					equals: folder.id
				}
			}
		})
		return ({ folders: folders, files: files });
	} catch (error) {
		throw (error);
	}
}

// TO DO: Delete this functions and implement them directly in index controller with prisma directly. Also create root folder when creating user

module.exports = {
	getUser,
	postUser,
	getFolderId,
	getAllChild,
}