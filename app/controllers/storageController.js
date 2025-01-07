const queries = require("#db/queries.js");
const { mkdir } = require("node:fs/promises");
const { body, validationResult } = require("express-validator");
const { rm } = require("node:fs");
const { readdir } = require("node:fs/promises");
const path = require("node:path");

async function getStorage(req, res, next) {
	let folderId = req.params.id ? req.params.id : "storage";
	try {
		const parentFolder = await queries.getFolderId(folderId, req.user.id);
		const result = await queries.getAllChild(parentFolder);
		const items = [...result.folders, ...result.files].sort((a, b) => a.name.localeCompare(b.name));
		const routeTree = await queries.getAllParentFolders(parentFolder);
		return res.render("storage", {
			items: items,
			childFolder: parentFolder.parentId === null ? null : parentFolder.id,
			navBar: routeTree,
			isDeletable: req.params.id ? true : false,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}

function postFile(req, res) {
	return res.redirect(getOriginalUrl(req));
}

const postFolder = [
	[
		body("folder").trim()
			.isLength({ min: 1, max: 255 }).withMessage("Folder length must have between 1 and 255 characters"),
	],
	async function postFolder(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("valErrors", errors.array());
			return res.status(400).redirect(getOriginalUrl(req));
		}
		try {
			const parentFolder = await queries.getFolderId(req.params.id, req.user.id);
			const isFolderPresent = await queries.findRepeatedFolder(req.body.folder, parentFolder.id);
			if (isFolderPresent) {
				req.flash("valErrors", [{ msg: "That folder already exists in this path" }]);
				return res.status(400).redirect(getOriginalUrl(req));
			}
			res.locals.newFolder = await queries.postFolder(req.body.folder, parentFolder.id, req.user.id);
			next();
		} catch (error) {
			console.error(error);
			next(error);
		}
	},
	async function createFolderInStorage(req, res, next) {
		try {
			const folders = await queries.getAllParentFolders(res.locals.newFolder);
			let uploadPath = `./uploads/${req.user.id}`;
			for (let i = folders.length - 1; i > -1; i--)
				uploadPath += `/${folders[i].name}`;
			await mkdir(uploadPath, { recursive: true });
			return res.redirect(getOriginalUrl(req));
		} catch (errorMkdir) {
			console.error(errorMkdir);
			try {
				await queries.deleteFolder(res.locals.newFolder.id, req.user.id);
			} catch (error) {
				console.error(error);
				next(error);
			}
			next(errorMkdir);
		}
	}
]

function getOriginalUrl(req) {
	const returnPath = req.originalUrl.split("/");
	returnPath.pop();
	return (returnPath.join("/"));
}

async function deleteFolder(req, res, next) {
	try {
		if (!req.params.id)
			return res.redirect(getOriginalUrl(req));
		const folders = await queries.getAllParentFolders(await queries.getFolderId(req.params.id, req.user.id));
		let deletePath = getPath(req, folders);
		const result = await queries.deleteFolder(req.params.id, req.user.id);
		if (!result)
			return res.status(400).json({ message: "Could not deleted folder" });
		rm(deletePath, { recursive: true, force: true }, (error) => {
			if (error) {
				console.error(error);
				return next(error);
			}
		});
		return res.json({ message: "Folder deleted successfully" });
	} catch (error) {
		console.error(error);
		next(error);
	}
}

function getPath(req, folders, toDelete = true) {
	let deletePath = `./uploads/${req.user.id}`;
	for (let i = folders.length - 1; i > -1; i--)
		deletePath += `/${folders[i].name}`;
	if ((deletePath === `./uploads/${req.user.id}/home` || deletePath === `./uploads/${req.user.id}/home/`) && toDelete === true)
		throw new Error("Invalid path to delete");
	return (deletePath);
}

async function getFileView(req, res, next) {
	try {
		const file = await queries.getFile(req.params.id, req.user.id);
		if (!file)
			return res.redirect("/");
		return res.render("fileView", {
			name: file.name,
			time: file.createdAt,
			parentFolder: file.folder.name,
			id: file.id,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}

async function downloadFile(req, res, next) {
	try {
		const file = await queries.getFile(req.params.id, req.user.id);
		if (!file)
			return (res.redirect("/"));
		const folders = await queries.getAllParentFolders(file.folder);
		let searchPath = getPath(req, folders, false);
		const directory = await readdir(searchPath, { withFileTypes: true });
		let filePath = localFile.fileDownload(directory, file, searchPath);
		return (res.download(filePath, file.name));
	} catch (error) {
		console.error(error);
		next(error);
	}
}

async function deleteFile(req, res, next) {
	try {
		const file = await queries.getFile(req.params.id, req.user.id);
		if (!file)
			return (res.json({ message: "Invalid file", location: "/" }));
		const folders = await queries.getAllParentFolders(file.folder);
		let searchPath = getPath(req, folders, false);
		const directory = await readdir(searchPath, { withFileTypes: true });
		if (!(await localFile.fileRemoval(directory, file, searchPath)))
			return (res.json({ message: "Invalid file", location: "/" }));
		let location = file.folder.parentId ? `/storage/${file.folder.id}` : "/storage";
		return res.json({ message: "File was deleted successfully", location });
	} catch (error) {
		console.error(error);
		next(error);
	}
}

const localFile = {
	fileDownload: (directory, file, searchPath) => {
		let filePath;
		for (const item of directory) {
			const match = item.name.match(/(\d+)-(\d+)-(.+)/);
			if (!match)
				continue;
			if (match[3] === file.name) {
				filePath = `./${path.join(searchPath, item.name)}`;
				break;
			}
		}
		return (filePath);
	},
	fileRemoval: async (directory, file, searchPath) => {
		let filePath = "";
		for (const item of directory) {
			const match = item.name.match(/(\d+)-(\d+)-(.+)/);
			if (!match || match[3] !== file.name)
				continue;
			filePath = `./${path.join(searchPath, item.name)}`;
			rm(filePath, { recursive: true, force: true }, async (fsError) => {
				if (fsError) {
					console.error(fsError);
					next(fsError);
				}
				await queries.deleteFile(file.id);
			});
			break;
		}
		return (filePath);
	},
}

module.exports = {
	getStorage,
	postFile,
	postFolder,
	deleteFolder,
	getFileView,
	downloadFile,
	deleteFile,
};