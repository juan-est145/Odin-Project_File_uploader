const queries = require("#db/queries.js");

async function getStorage(req, res, next) {
	let folderId = req.params.id ? req.params.id : "storage";
	try {
		const parentFolder = await queries.getFolderId(folderId, req.user.id);
		const result = await queries.getAllChild(parentFolder);
		console.log(result);
		const items = [...result.folders, ...result.files].sort((a, b) => a.name.localeCompare(b.name));
		return res.render("storage", { items: items,  childFolder: parentFolder.parentId === null? null: parentFolder.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
}

function postStorage(req, res, next) {
	//TO DO: Redirect to previous folder. Might need to use split
	return res.redirect("/storage");
}


module.exports = {
	getStorage,
	postStorage,
};