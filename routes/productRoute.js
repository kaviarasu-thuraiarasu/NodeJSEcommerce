const express = require('express');
const router = express.Router();
const { createProduct,
    getProduct,
    getAllProduct,
    deleteProduct,
    updateProduct}  = require("../controller/productCtrl")

router.post('/create',createProduct)
router.get('/getAllProduct',getAllProduct)
router.get('/getProduct/:id',getProduct)
router.delete('/deleteProduct/:id',deleteProduct)
router.put('/updateProduct/:id',updateProduct)

module.exports = router