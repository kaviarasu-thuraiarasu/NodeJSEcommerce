const productSchema = require("../models/productModel")
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
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

const addTowishlist = async (req,res,next)=>{
    const {id} = req.user
    const {prodId} = req.body
    const user = await User.findById(id)
    const alreadyAdded = await user.wishlist.find((id)=> id.toString() === prodId.toString())
    if(alreadyAdded){
        const wish = await User.findByIdAndUpdate(id,{
            $pull:{wishlist:prodId}
        },{
            new:true
        })
        res.send(wish)
    }else{
        const wish = await User.findByIdAndUpdate(id,{
            $push:{wishlist:prodId}
        },{
            new:true
        })
        res.send(wish)

    }
}

const rating = async (req,res,next)=>{
    const {id} = req.user
    const {star,prodId, comment}= req.body

    const product = await productSchema.findById(prodId)
    const alreadyAdded = product.ratings.find((userId)=> userId.postedby.toString() === id.toString())
    if(alreadyAdded){

        const update = await productSchema.updateOne(
            {
                ratings:{ $elemMatch : alreadyAdded }
            },
            {
                $set:{"ratings.$.star":star, "ratings.$.comment":comment}
            },
            {
                new:true
            }
        )
       // res.send(update)

    }else{
        const update = await productSchema.findByIdAndUpdate(prodId,{
           $push:{
            ratings:{
                star:star,
                postedby:id,
                comment:comment
            }
           } 
        },{
            new:true
        })

       // res.send(update)
    }

    const prod = await productSchema.findById(prodId)
    const totalRatingCount = prod.ratings.length
    const totalRating = prod.ratings.map(rating => rating.star).reduce((prev,cur)=> prev+cur,0)
    const avg = Math.round(totalRating/totalRatingCount)
    const final = await productSchema.findByIdAndUpdate(prodId,{totalratings:avg},{new:true})
    res.send(final)

}

const createCoupon = async (req,res)=>{

    const coupon = await Coupon.create(req.body)
    res.json(coupon)

}
   
const applyCoupon = async (req, res)=>{
    const {id} = req.user
    const {coupon} = req.body
    const isAvailable = await Coupon.findOne({name:coupon})

    if(isAvailable  === null){
        throw new Error("Coupon not valid")
    }
    const usr = await User.findById(id)
    const {product,cartTotal} = await Cart.findOne({orderBy:usr._id}).populate("products.product")
    let totalAfterDiscount = cartTotal - (cartTotal*isAvailable.discount/100)

    await Cart.findOneAndUpdate({orderBy:usr._id},{
        totalAfterDiscount:totalAfterDiscount
    },{new:true})
    res.json(totalAfterDiscount)
}

module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    deleteProduct,
    updateProduct,
    addTowishlist,
    rating,
    createCoupon,
    applyCoupon
}