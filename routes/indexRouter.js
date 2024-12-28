const { Router } = require("express");
const controllers = require("#controllers/indexController.js");

const indexRouter = Router();

indexRouter.get("/", controllers.getIndex);

module.exports = indexRouter;