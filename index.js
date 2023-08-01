const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000
const dbConnect = require('./config/dbConnect')
require("express-async-errors")

const authRouter = require('./routes/authRoute')
const productRouter = require("./routes/productRoute")
const blogRouter = require("./routes/blogRoute")
const blogcategoryRouter = require("./routes/blogcategoryRoute")
const productcategoryRouter = require("./routes/productcategoryRoute")
const brandRouter = require("./routes/brandRoute")
const cookieParser = require("cookie-parser")
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use("/api/user",authRouter)
app.use("/api/product",productRouter)
app.use("/api/blog",blogRouter)
app.use("/api/blogcategory",blogcategoryRouter)
app.use("/api/productcategory",productcategoryRouter)
app.use("/api/brandcategory",brandRouter)
app.use((err,req,res,next)=>{
 res.send(err.message)
})
const startServer = async ()=>{
    await dbConnect()
    app.listen(PORT,console.log(`Server running at the ${PORT}`))
}
startServer()
