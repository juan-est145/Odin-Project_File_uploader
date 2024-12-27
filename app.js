const { PrismaClient } = require("@prisma/client");
const express = require("express");
require("dotenv").config();
const { testCont } = require("#controllers/test.js")


const app = express();
const prisma = new PrismaClient();

app.use("/", testCont);

app.listen(process.env.PORT || 3000, () => console.log("App listening in port 3000"));