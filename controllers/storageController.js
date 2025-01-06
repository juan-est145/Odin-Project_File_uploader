const queries = require("#db/queries.js");
const { mkdir } = require("node:fs/promises");
const { body, validationResult } = require("express-validator");

async function getStorage(req, res, next) {
	let folderId = req.params.id ? req.params.id : "storage";
	try {
		const parentFolder = await queries.getFolderId(folderId, req.user.id);
		const result = await queries.getAllChild(parentFolder);
		const items = [...result.folders, ...result.files].sort((a, b) => a.name.localeCompare(b.name));
		return res.render("storage", { items: items, childFolder: parentFolder.parentId === null ? null : parentFolder.id });
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
		} catch (error) {
			// Delete the folder from the database if there is an error creating the folder
			next(error);
		}
	}
]

function getOriginalUrl(req) {
	const returnPath = req.originalUrl.split("/");
	returnPath.pop();
	return (returnPath.join("/"));
}


module.exports = {
	getStorage,
	postFile,
	postFolder,
};