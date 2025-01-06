const { Router } = require("express");
const controllers = require("#controllers/storageController.js");
const upload = require("#multer/multer.js");

const storageRouter = Router();

storageRouter.use((req, res, next) => {
	if (!req.isAuthenticated())
		return res.redirect("/");
	next();
});

storageRouter.get("/(:id)?", controllers.getStorage);
storageRouter.post("/(:id/)?uploadFile", upload.single("file"), controllers.postFile);
storageRouter.post("/(:id/)?uploadFolder", controllers.postFolder);
storageRouter.get("/file/:id", (req, res) => {
	res.send("This works for now");
});

module.exports = storageRouter;