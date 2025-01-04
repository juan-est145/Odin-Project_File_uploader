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

storageRouter.get("/(:id)?", controllers.getStorage);
//Make extensive tests with the id param to make sure that the regex is correct
storageRouter.post("/(:id/)?uploadFile", upload.single("file"), controllers.postFile);
storageRouter.post("/(:id/)?uploadFolder", controllers.postFolder);

module.exports = storageRouter;