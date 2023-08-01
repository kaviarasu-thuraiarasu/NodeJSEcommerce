const express = require('express');
const router = express.Router();
const {auth,isAdmin} = require("../middlewares/auth")
const { createProduct,
    getProduct,
    getAllProduct,
    deleteProduct,
    updateProduct}  = require("../controller/productCtrl")

router.post('/create',auth,isAdmin,createProduct)
router.get('/getAllProduct',getAllProduct)
router.get('/getProduct/:id',getProduct)
router.delete('/deleteProduct/:id',auth,isAdmin,deleteProduct)
router.put('/updateProduct/:id',auth,isAdmin,updateProduct)

module.exports = router