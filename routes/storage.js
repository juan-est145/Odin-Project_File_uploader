const { Router } = require("express");

const storageRouter = Router();
storageRouter.get("/", (req, res, next) => {
	if (!req.isAuthenticated())
		return res.send("You are not logged in");
	return res.render("storage");
});

module.exports = storageRouter;