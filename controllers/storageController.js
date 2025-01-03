const queries = require("#db/queries.js");

async function getStorage(req, res, next) {
	let folderId = req.params.name ? req.params.name : "storage";
	try {
		const parentFolder = await queries.getFolderId(folderId, req.user.id);
		const result = await queries.getAllChild(parentFolder);
		console.log(result);
		const items = [...result.folders, ...result.files].sort((a, b) => a.name > b.name);
		return res.render("storage", { items: items });
	} catch (error) {
		console.error(error);
		next(error);
	}

}

function postStorage(req, res, next) {
	return res.redirect("/storage");
}


module.exports = {
	getStorage,
	postStorage,
};