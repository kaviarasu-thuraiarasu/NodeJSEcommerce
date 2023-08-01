const Category = require("../models/blogcategoryModel")
const isValid = require("../utils/validateMongoID");

const createCategory = async (req, res, next) => {
    const newCategory = await Category.create(req.body) 
    res.json(newCategory)
}

const getAllCategory = async (req, res, next) => {

    const category = await Category.find();
    res.json(category)
}

const getCategory= async (req, res, next) => {
    try{
        const {id} = req.params
       // isValid(id)
        const category = await Category.findById(id)
        res.json(category)
    }catch(e){
        throw new Error(e.message)
    }
    
}

const deleteCategory = async (req, res, next) => {
    try{
        const {id} = req.params
       // isValid(id)
        const category = await Category.findByIdAndDelete(id)
        res.json("Deleted Successfully")
    }catch(e){
        throw new Error(e.message)
    }
}

const updateCategory = async (req, res, next) => {
    try{
        const {id} = req.params
       // isValid(id)
        const category = await Category.findByIdAndUpdate(id,req.body,{new:true})
        res.json("Updated Successfully")
    }catch(e){
        throw new Error(e.message)
    }
}
module.exports = {createCategory,getAllCategory,getCategory,deleteCategory,updateCategory}