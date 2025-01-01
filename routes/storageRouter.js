const { Router } = require("express");
const controllers = require("#controllers/storageController.js");
const upload = require("#multer/multer.js");

const storageRouter = Router();

storageRouter.use((req, res, next) => {
	if (!req.isAuthenticated())
		return res.status(401).send("Not for now");
	next();
	//Later implement a view for not logged users
});


storageRouter.get("/", controllers.getStorage);
storageRouter.post("/", upload.single("file"), controllers.postStorage);

module.exports = storageRouter;