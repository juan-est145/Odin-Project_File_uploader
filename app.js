const express = require("express");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { sessionConfig } = require("#auth/sessionConfig.js");
const { passportConf } = require("#auth/passport.js");
const indexRouter = require("#routes/indexRouter.js");
const storageRouter = require("#routes/storageRouter.js");

const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionConfig);
app.use(passportConf);
app.use(flash());
app.disable("x-powered-by");
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			"style-src": "'self'",
		}
	}
}));

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});
app.use("/", indexRouter);
app.use("/storage", storageRouter);

app.use((req, res) => {
	res.status(404).send("404: Page not found");
});
app.use((error, req, res, next) => {
	console.error(error.stack);
	res.status(500).send("Something went wrong, please, try at another time");
});

app.listen(process.env.PORT || 3000, () => console.log("App listening in port 3000"));