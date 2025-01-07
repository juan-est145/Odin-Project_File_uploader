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
storageRouter.delete("/:id/deleteFolder", controllers.deleteFolder);
storageRouter.get("/file/:id", controllers.getFileView);
storageRouter.get("/file/:id/download", controllers.downloadFile);
storageRouter.delete("/file/:id/delete", controllers.deleteFile);

module.exports = storageRouter;