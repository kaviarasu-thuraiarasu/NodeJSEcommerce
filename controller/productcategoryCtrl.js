const ProductCategory = require("../models/categoryModel")
const isValid = require("../utils/validateMongoID");

const productcreateCategory = async (req, res, next) => {
    const newCategory = await ProductCategory.create(req.body) 
    res.json(newCategory)
}
module.exports = {productcreateCategory}