const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is mandatory"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is mandatory"],
    },
    email: {
      type: String,
      required: [true, "email is mandatory"],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "mobile is mandatory"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is mandatory"],
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken:{
        type:String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};
// userSchema.post('save', function(error, doc, next) {
//     if (error.name === 'MongoServerError' || error.code === 11000) {
//       next(new Error('There was a duplicate key error'));
//     } else {
//       next();
//     }
//   });

//Export the model
module.exports = mongoose.model("User", userSchema);
