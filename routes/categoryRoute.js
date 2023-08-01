const express = require('express');
const route = express.Router();
const {auth,isAdmin} = require("../middlewares/auth")
const {createCategory,} = require("../controller/categoryCtrl")
route.post("/create",auth,isAdmin,createCategory)

module.exports = route