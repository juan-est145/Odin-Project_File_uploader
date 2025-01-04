const queries = require("#db/queries.js");
const { body, validationResult } = require("express-validator");

async function getStorage(req, res, next) {
	let folderId = req.params.id ? req.params.id : "storage";
	try {
		const parentFolder = await queries.getFolderId(folderId, req.user.id);
		const result = await queries.getAllChild(parentFolder);
		console.log(result);
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
			// Need to handle validation errors, probably use req.flash
			return console.log("There is an error");
		}
		try {
			const parentFolder = await queries.getFolderId(req.params.id, req.user.id);
			await queries.postFolder(req.body.folder, parentFolder.id, req.user.id);
			let path = req.params.id ? `/storage/${req.params.id}` : "/storage";
			return res.redirect(path);
		} catch (error) {
			console.error(error);
			next(error);
		}

	}
]


module.exports = {
	getStorage,
	postFile,
	postFolder,
};