const asyncWrapper = (cb)=>{

    return (req,res,next)=>{
        try{
            cb(req,res,next)
        }catch(e){
           return next(e)
        }
        
    }

}

module.exports = asyncWrapper