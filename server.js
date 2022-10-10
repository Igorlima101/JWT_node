const express = require("express")
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const routes = require("./src/routes")

app.use(express.json())
app.use(routes)

mongoose.connect(process.env.MONGO_CONNECTION)
.then(() => {
    console.log("database connected")
}) 
.catch((error) => console.log(error))
app.listen(5050, console.log("Server on"))
