const productSchema = require("../models/productModel")

const createProduct = async (req,res,next)=>{

    const {title} = req.body
    if(title) req.body.slug = title
    const product = await productSchema.create(req.body)
    res.json(product)

}

const getProduct = async (req,res,next)=>{
    const {id} = req.params
    const product = await productSchema.findById({_id:id})
    res.json(product)
    
}
const getAllProduct = async (req,res,next)=>{
    const product = await productSchema.find({})
    res.json(product)
}
const deleteProduct = async (req,res,next)=>{
    const {id} = req.params
    await productSchema.findByIdAndDelete({_id:id})
    res.send("Deleted Successfully")
}
const updateProduct = async (req,res,next)=>{

    const {id} = req.params
    await productSchema.findByIdAndUpdate({_id:id},req.body,{new:true})
    res.send("updated Successfully")
}
    

module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    deleteProduct,
    updateProduct
}