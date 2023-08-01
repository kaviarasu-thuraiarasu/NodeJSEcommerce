const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const isValid = require("../utils/validateMongoID");


const createBlog = async (req, res, next) =>{

    const newBlog = await Blog.create(req.body)
    res.json(newBlog)
}

const updateBlog = async (req, res, next) =>{

    const {id} = req.params
    const updatedBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
    res.json({
        status:'updated',
        data:updatedBlog })
}

const getAllBlog = async (req, res, next) =>{

    const blogs = await Blog.find()
    res.json(blogs)
    
}

const getBlog = async (req, res, next) =>{
    const {id} = req.params
    const blog = await Blog.findById(id)
                      .populate('likes')
                      .populate('dislikes')
                    // Populate will fetch the reference table value
    const updateBlogView = await Blog.findByIdAndUpdate(id,{$inc:{numViews:1}},{new:true})
    res.json(blog)
    
}

const deleteBlog = async (req, res, next) =>{

    const {id} = req.params
    const deletedBlog = await Blog.findByIdAndDelete(id)
    res.json({
        status:'Deleted',
        data:deletedBlog })
}

const likeBlog = async (req, res, next) =>{
    const {blogId} = req.body
    isValid(blogId)
    const blog = await Blog.findById(blogId)
    const user = req?.user?._id
    const isLiked = blog?.isLiked
    const alreadyDisLiked = blog?.dislikes?.find((userId) => userId.toString() === user.toString())
    if(alreadyDisLiked){
        const updateBlog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                dislikes:user
            },
            isDisliked:false
        },{new:true})
        res.json(updateBlog)
    }

    if(isLiked){
        const updateBlog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                likes:user
            },
            isLiked:false
        },{new:true})
        res.json(updateBlog)
    }else{
        const updateBlog = await Blog.findByIdAndUpdate(blogId,{
            $push:{
                likes:user
            },
            isLiked:true
        },{new:true})
        res.json(updateBlog)
    }
}


const dislikeBlog = async (req, res, next) =>{
    const {blogId} = req.body
    isValid(blogId)
    const blog = await Blog.findById(blogId)
    const user = req?.user?._id
    const disLiked = blog?.isDisliked
    const alreadyLiked = blog?.likes?.find((userId) => userId.toString() === user.toString())
    if(alreadyLiked){
        const updateBlog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                likes:user
            },
            isLiked:false
        },{new:true})
        res.json(updateBlog)
    }

    if(disLiked){
        const updateBlog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                dislikes:user
            },
            isDisliked:false
        },{new:true})
        res.json(updateBlog)
    }else{
        const updateBlog = await Blog.findByIdAndUpdate(blogId,{
            $push:{
                dislikes:user
            },
            isDisliked:true
        },{new:true})
        res.json(updateBlog)
    }
}

module.exports = {
    createBlog,
    getAllBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog
}
