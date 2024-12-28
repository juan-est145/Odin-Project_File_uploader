const express = require("express");
require("dotenv").config();
const { testCont } = require("#controllers/test.js")
const { sessionConfig } = require("#auth/sessionConfig.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

app.use("/", testCont);
app.use((req, res) => {
	res.status(404).send("404: Page not found");
});
app.use((error, req, res, next) => {
	console.error(error.stack);
	res.status(500).send("Something went wrong, please, try at another time");
});

app.listen(process.env.PORT || 3000, () => console.log("App listening in port 3000"));