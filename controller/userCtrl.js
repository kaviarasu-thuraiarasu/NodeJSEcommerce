const user = require("../models/userModel");
//const asyncWrapper = require("../middlewares/asyncWrapper");
const generateToken = require("../config/jwtToken");
//const mongoose = require("mongoose");
const isValid = require("../utils/validateMongoID");
const refreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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

const logout = async (req,res,next)=>{
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No Refresh token in cookies");
  const users = await user.findOne({ refreshToken });
  if (!users) {
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure:true
    });
    return res.sendStatus(204) // Forbidden
  }

  const updateRefreshToken = await user.findOneAndUpdate(
    { _id: users?._id },
    { refreshToken: '' },
    {
      new: true,
    }
  );

  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure:true
  });
  return res.sendStatus(204) // Forbidden

}

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
  logout
};
