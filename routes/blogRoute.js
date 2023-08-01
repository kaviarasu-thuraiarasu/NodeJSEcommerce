const express = require('express');
const route = express.Router();
const {createBlog,
    getAllBlog,
    getBlog,updateBlog,deleteBlog,likeBlog,dislikeBlog} = require("../controller/blogCtrl")
const {auth,isAdmin} = require("../middlewares/auth")
route.post("/create",auth,isAdmin,createBlog)
route.put("/update/:id",auth,isAdmin,updateBlog)
route.put("/getBlog/:id",auth,isAdmin,getBlog)
route.get("/getAllBlog",getAllBlog)
route.delete("/delete/:id",auth,isAdmin,deleteBlog)
route.put("/like",auth,isAdmin,likeBlog)
route.put("/dislike",auth,isAdmin,dislikeBlog)
module.exports = route