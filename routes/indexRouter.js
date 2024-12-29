const { Router } = require("express");
const controllers = require("#controllers/indexController.js");

const indexRouter = Router();

indexRouter.use((req, res, next) => {
	res.locals.valErrors = req.flash("valErrors");
	next();
});

indexRouter.get("/", controllers.getIndex);
indexRouter.get("/sign-up", controllers.getSignUp);
indexRouter.get("/log-out", controllers.getLogOut);
indexRouter.post("/", controllers.postLogIn);
indexRouter.post("/sign-up", controllers.postSignUp);

module.exports = indexRouter;