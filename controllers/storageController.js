const queries = require("#db/queries.js");
const { mkdir } = require("node:fs/promises");
const { body, validationResult } = require("express-validator");

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

// TO DO: Cascade the delete of a folder and it's files. Also need to delete the local folder in uploads
async function deleteFolder(req, res, next) {
	try {
		if (!req.params.id)
			return res.redirect(getOriginalUrl(req));
		const result = await queries.deleteFolder(req.params.id, req.user.id);
		if (result)
			return res.json({ message: "Folder deleted successfully" });
		return res.status(400).json({ message: "Could not deleted folder"});
	} catch (error) {
		console.error(error);
		next(error);
	}
}

module.exports = {
	getStorage,
	postFile,
	postFolder,
	deleteFolder,
};