//controller for '/'
const renderHome=(req,res)=>{
    res.status(200).json({"msg":"server runnig.."})
};

module.exports={renderHome};