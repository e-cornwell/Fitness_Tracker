require("dotenv").config()
const express = require("express")
const app = express()
app.use(express.json())
// Setup your Middleware and API Router here
const cors = require('cors')
app.use(cors());

const apiRouter = require("./api")
app.use("/api", apiRouter)

module.exports = app;
