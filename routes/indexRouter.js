const { Router } = require("express");
const controllers = require("#controllers/indexController.js");

const indexRouter = Router();

indexRouter.get("/", controllers.getIndex);
indexRouter.get("/sign-up", controllers.getSignUp);

module.exports = indexRouter;