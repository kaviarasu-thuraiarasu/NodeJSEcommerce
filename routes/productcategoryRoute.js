const express = require('express');
const route = express.Router();
const {auth,isAdmin} = require("../middlewares/auth")
const {productcreateCategory,} = require("../controller/productcategoryCtrl")
route.post("/create",auth,isAdmin,productcreateCategory)

module.exports = route