const { prisma } = require("#auth/sessionConfig.js");

async function getUser(conditions) {
	try {
		const user = await prisma.user.findUnique({ where: conditions })
		return (user);
	} catch (error) {
		throw error;
	}
}

async function postUser(username, password) {
	try {
		const user = await prisma.user.create({
			data: {
				username,
				password,
			},
		});
		await prisma.folder.create({
			data: {
				name: "home",
				userId: user.id,
				parentId: null
			}
		});
		return (user);
	} catch (folderError) {
		try {
			await prisma.user.delete({
				where: {
					username
				}
			});
			throw folderError;
		} catch (error) {
			throw error;
		}
	}
}

async function getFolderId(folderId, userId) {
	try {
		const folder = await prisma.folder.findFirst({
			where: {
				userId: {
					equals: userId
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
					equals: userId
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

async function findRepeatedFolder(name, parentId) {
	try {
		const result = prisma.folder.findFirst({
			where: {
				name : {
					equals: name
				},
				AND: {
					parentId: {
						equals: parentId
					}
				}
			}
		});
		return (result);
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

async function postFile(file, user, folderId) {
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

async function postFolder(name, parentId, userId) {
	try {
		const result = await prisma.folder.create({
			data: {
				name,
				parentId,
				userId
			}
		});
		return (result);
	} catch (error) {
		throw error;
	}
}

async function getAllParentFolders(folder) {
	try {
		const folders = [];
		folders.push(folder);
		do {
			let result = await prisma.folder.findUnique({
				where: {
					id: folders[folders.length - 1].parentId
				}
			});
			if (result)
				folders.push(result);
		} while (folders[folders.length - 1].parentId);
		return (folders);
	} catch (error) {
		throw error;
	}
}


module.exports = {
	getUser,
	postUser,
	getFolderId,
	findRepeatedFolder,
	getAllChild,
	postFile,
	postFolder,
	getAllParentFolders,
}