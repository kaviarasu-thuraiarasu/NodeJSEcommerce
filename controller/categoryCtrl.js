const Category = require("../models/categoryModel")
const isValid = require("../utils/validateMongoID");

const createCategory = async (req, res, next) => {
    const newCategory = await Category.create(req.body) 
    res.json(newCategory)
}
module.exports = {createCategory}