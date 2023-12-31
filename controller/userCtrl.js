const user = require("../models/userModel");
//const asyncWrapper = require("../middlewares/asyncWrapper");
const generateToken = require("../config/jwtToken");
//const mongoose = require("mongoose");
const isValid = require("../utils/validateMongoID");
const refreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")

const createUser = async (req, res, next) => {
  //try{

  const { email, mobile, password, firstname, lastname } = req.body;
  if (!email || !mobile || !password || !firstname || !lastname) {
    throw new Error("Please fill all the mandatory field");
  }
  const findUser = await user.findOne({ email });
  if (!findUser) {
    const userData = await user.create(req.body);
    res.send(userData);
  } else {
    res.send("User Already Exist");
  }
  // }catch(e){
  //     throw new Error("fdjf")
  // }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Please fill all the mandatory field");
  }
  const findUser = await user.findOne({ email });
  if (!findUser) {
    throw new Error("Email not exist");
  }
  const isPasswordmatched = await findUser.comparePassword(password);
  if (!isPasswordmatched) {
    throw new Error("Password not match for the user");
  }

  const refresh = await refreshToken(findUser?._id);
  const updateRefreshToken = await user.findOneAndUpdate(
    { _id: findUser?._id },
    { refreshToken: refresh },
    {
      new: true,
    }
  );
  const token = await generateToken(findUser?._id);
  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.send({
    firstname: findUser?.firstname,
    lastname: findUser?.lastname,
    email: email,
    token: token,
  });
};

const handleRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No Refresh token in cookies");
  const users = await user.findOne({ refreshToken });
  if (!users) throw new Error("No refresh token exist in DB");
  const validRefreshToken = await jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_KEY
  );
  if (!validRefreshToken || users._id != validRefreshToken.id)
    throw new Error("Something wrong in Refresh token");
  const accessToken = await generateToken(users?._id);
  res.send({ accessToken });
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No Refresh token in cookies");
  const users = await user.findOne({ refreshToken });
  if (!users) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // Forbidden
  }

  const updateRefreshToken = await user.findOneAndUpdate(
    { _id: users?._id },
    { refreshToken: "" },
    {
      new: true,
    }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); // Forbidden
};

const getAllUser = async (req, res, next) => {
  const allUser = await user.find({});
  res.send(allUser);
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  await isValid(id);
  const data = await user.findById(id);
  if (!data) {
    throw new Error("Data not available for the Users");
  }
  res.send(data);
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  await isValid(id);
  const deletedUser = await user.findOneAndRemove({ _id: id });
  if (!deletedUser) {
    throw new Error("Given ID not exist");
  }
  res.send("Deleted Successfully");
};

const updateUser = async (req, res, next) => {
  const {
    params: { id },
    body: { firstname, lastname, email, mobile, password },
  } = req;
  await isValid(id);
  const updatedUser = await user.findByIdAndUpdate(
    { _id: id },
    { firstname, lastname, email, mobile, password },
    { new: true }
  );
  if (!updatedUser) {
    throw new Error("Given ID not exist");
  }
  res.send(updatedUser);
};

const blockUser = async (req, res, next) => {
  const { id } = req.params;
  await isValid(id);
  const blockUser = await user.findByIdAndUpdate(
    { _id: id },
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  if (!blockUser) {
    throw new Error("ID Mismatch");
  }
  res.send(blockUser);
};

const unblockUser = async (req, res, next) => {
  const { id } = req.params;
  await isValid(id);
  const unblockUser = await user.findByIdAndUpdate(
    { _id: id },
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  if (!unblockUser) {
    throw new Error("ID Mismatch");
  }
  res.send(unblockUser);
};

const updatePassword = async (req, res, next) => {
  const { _id } = req.user;
  const { password } = req.body;
  await isValid(_id);
  const usr = await user.findById({ _id });
  if (password) {
    usr.password = password;
    const updatedPassword = await usr.save();
    return res.send(updatedPassword);
  }
  res.send(usr);
};

const forgotPassword = async (req, res,next) => {

  const {email} = req.body
  const usr = await user.findOne({ email: email})
  if(!usr){
    throw new Error("Email is not valid to reset the password")
  }
  const token = await usr.createPasswordResetToken() 
  await usr.save()                                                                                                                         
// Here Send email with URL+token as querry param
// check 4.05.29 minutes for reference
res.json(token)
}

const resetPassword = async (req, res) => {
  const {password} = req.body
  const token = req.params
  const hashedToken = crypto.createHash("sha256").update(token).digest('hex');
  const usr = await user.find({passwordResetToken:hashedToken,passwordResetExpires:{$ge:Date.now()}})
  if(!usr) throw new Error("not an vaid token")
  usr.password = password
  usr.passwordResetToken = undefined
  usr.passwordResetExpires = undefined

  await usr.save()
  res.json("Password reseted Successfully")


}

const saveAddress = async (req, res) => {
  const {id} = req.user
  const {address} = req.body
  const usr = await user.findByIdAndUpdate(id,{
    $push:{address:address}
  },{new:true})

  res.json(usr)

}

const userCart = async (req, res) => {
  let product = []
  const {id} = req.user
  isValid(id)
  const {cart} = req.body
  const usr = await user.findById(id)
  const alreadyCartExist = await Cart.findOne({orderBy:user._id})
  console.log(cart)
  if(alreadyCartExist){
    alreadyCartExist.remove()
  }else{

    for(i=0;i<cart.length;i++){
      let obj = {}
      obj.product = cart[i]._id
      obj.quantity = cart[i].quantity
      obj.color = cart[i].color
      let getPrice = await Product.findById(cart[i]._id).select('price').exec()
      obj.price = getPrice.price
      product.push(obj)
    }
    let cartTotal = 0
    for (i=0;i<product.length;i++){
      cartTotal = cartTotal + product[i].price * product[i].quantity
    }

    const createModel  = await new Cart({
      products:product,
      cartTotal,
      orderBy : id

    }).save()
    res.send(createModel)
  }
 res.send("Hello cart")
}

const getCart = async (req, res) => {
  const {id} = req.user
  const cart = await Cart.findOne({orderBy:id}).populate('products.product')
  res.send(cart)

}

const emptyCart = async (req, res)=>{
  const {id} = req.user

  const usr = await user.findOne({_id:id})
  console.log(usr.id)
  const cart = await Cart.findOneAndRemove({orderBy:usr.id})
  res.send(cart)

}

module.exports = {
  createUser,
  login,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  saveAddress,
  userCart,
  getCart,
  emptyCart
};
