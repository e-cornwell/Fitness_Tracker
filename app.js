require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const cors = require('cors')
app.use(cors());

app.use(express.json())

const apiRouter = require("./api")
app.use("/api", apiRouter)

app.use((req, res) => {
    res.status(404).send(
      {success: false , message: "Request failed with status 404"} 
    );
});

module.exports = app;
