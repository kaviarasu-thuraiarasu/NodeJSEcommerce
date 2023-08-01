const express = require('express');
const route = express.Router();
const {auth,isAdmin} = require("../middlewares/auth")
const {createCategory,getAllCategory,getCategory,deleteCategory,updateCategory} = require("../controller/blogcategoryCtrl")
route.post("/",auth,isAdmin,createCategory)
route.get("/",getAllCategory)
route.get("/:id",getCategory)
route.put("/:id",updateCategory)
route.delete("/:id",deleteCategory)
module.exports = route