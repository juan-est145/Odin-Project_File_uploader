function getStorage(req, res) {
	return res.render("storage");
}

function postStorage(req, res, next) {
	return res.redirect("/storage");
}


module.exports = {
	getStorage,
	postStorage,
};