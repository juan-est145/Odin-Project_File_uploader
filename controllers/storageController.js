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

function postFile(req, res, next) {
	//TO DO: Redirect to previous folder. Might need to use split
	return res.redirect("/storage");
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
			const returnPath = req.originalUrl.split("/");
			returnPath.pop();
			return res.status(400).redirect(returnPath.join("/"));
		}
		try {
			// TO DO: Check for repeated folder names with the same parent folderId.
			const parentFolder = await queries.getFolderId(req.params.id, req.user.id);
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
			let redirectPath = req.params.id ? `/storage/${req.params.id}` : "/storage";
			return res.redirect(redirectPath);
		} catch (error) {
			// Delete the folder from the database if there is an error creating the folder
			next(error);
		}
	}
]


module.exports = {
	getStorage,
	postFile,
	postFolder,
};