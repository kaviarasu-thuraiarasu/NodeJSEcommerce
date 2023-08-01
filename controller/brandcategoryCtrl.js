const Brand = require("../models/brandModel")
const isValid = require("../utils/validateMongoID");

const createBrand = async (req, res, next) => {
    const newBrand = await Brand.create(req.body) 
    res.json(newBrand)
}

const getAllBrand = async (req, res, next) => {

    const category = await Brand.find();
    res.json(category)
}

const getBrand= async (req, res, next) => {
    try{
        const {id} = req.params
       // isValid(id)
        const category = await Brand.findById(id)
        res.json(category)
    }catch(e){
        throw new Error(e.message)
    }
    
}

const deleteBrand = async (req, res, next) => {
    try{
        const {id} = req.params
       // isValid(id)
        const category = await Brand.findByIdAndDelete(id)
        res.json("Deleted Successfully")
    }catch(e){
        throw new Error(e.message)
    }
}

const updateBrand = async (req, res, next) => {
    try{
        const {id} = req.params
       // isValid(id)
        const category = await Brand.findByIdAndUpdate(id,req.body,{new:true})
        res.json("Updated Successfully")
    }catch(e){
        throw new Error(e.message)
    }
}
module.exports = {createBrand,getAllBrand,getBrand,deleteBrand,updateBrand}