function getIndex(req, res) {
	res.render("index");
}

function getSignUp(req, res) {
	res.render("signUp");
}

module.exports = {
	getIndex,
	getSignUp,
};