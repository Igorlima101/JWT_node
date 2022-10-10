const express = require("express")
const { checkToken } = require("../src/controllers/User-controller")
const routes = express.Router()
const Users = require("../src/controllers/User-controller")

routes.get("/",checkToken, Users.list)
routes.post("/post", Users.createUser)
routes.post("/login", Users.login)
routes.delete("/delete/:_id",checkToken, Users.delete)
module.exports = routes