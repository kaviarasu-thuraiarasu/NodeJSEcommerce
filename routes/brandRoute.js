const express = require('express');
const route = express.Router();
const {auth,isAdmin} = require("../middlewares/auth")
const {createBrand,getAllBrand,getBrand,deleteBrand,updateBrand} = require("../controller/brandcategoryCtrl")
route.post("/",auth,isAdmin,createBrand)
route.get("/",getAllBrand)
route.get("/:id",getBrand)
route.put("/:id",updateBrand)
route.delete("/:id",deleteBrand)
module.exports = route