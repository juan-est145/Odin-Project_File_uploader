const { prisma } = require("#auth/sessionConfig.js");

async function getUser(conditions) {
	try {
		const user = await prisma.user.findUnique({ where: conditions })
		return (user);
	} catch (error) {
		throw error;
	}
}

//TO DO: Create home/root folder along with the new user
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

async function registerFile(file, user, folderId) {
	try {
		await prisma.file.create({
			data: {
				name: file.originalname,
				userId: user.id,
				folderId,
			}
		});
	} catch (error) {
		throw (error);
	}
	
}


module.exports = {
	getUser,
	postUser,
	getFolderId,
	getAllChild,
	registerFile,
}