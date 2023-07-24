const express = require('express');
const router = express.Router();
const {auth,isAdmin} = require("../middlewares/auth")
const {createUser,login,getAllUser,getUser,deleteUser,updateUser,blockUser,unblockUser, handleRefreshToken,logout} = require('../controller/userCtrl')
router.post('/register',createUser)
router.post('/login',login)
router.get('/all-user',getAllUser)
router.get('/getUser/:id',auth,isAdmin,getUser)
router.delete('/deleteUser/:id',deleteUser)
router.put('/updateUser/:id',auth,updateUser)
router.put('/blockUser/:id',auth,isAdmin,blockUser)
router.put('/unblockUser/:id',auth,isAdmin,unblockUser)
router.get('/refresh',handleRefreshToken)
router.get('/logout',logout)
module.exports = router