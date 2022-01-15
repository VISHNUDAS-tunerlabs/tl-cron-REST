//controller for '/'
const renderHome=(req,res)=>{
    res.status(200).json({"msg":"server runnig.."})
};

//API/jobs
const createJob=async(req,res)=>{
    const job=req.body || {};
};


module.exports={renderHome,createJob};