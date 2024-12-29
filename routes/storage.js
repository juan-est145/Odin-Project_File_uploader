const { Router } = require("express");

const storageRouter = Router();

storageRouter.use((req, res, next) => {
	if (!req.isAuthenticated())
		return res.status(401).send("Not for now");
	next();
	//Later implement a view for not logged users
});


storageRouter.get("/", (req, res, next) => {
	if (!req.isAuthenticated())
		return res.send("You are not logged in");
	return res.render("storage");
});

module.exports = storageRouter;