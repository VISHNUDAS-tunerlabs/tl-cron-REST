const { jobs } = require('agenda/dist/agenda/jobs');
const {jobsReady,agenda,defineJob}=require('./agendaFn');

//controller for '/'
const renderHome=(req,res)=>{
    res.status(200).json({"msg":"server running.."})
};

//API/jobs
const createJob=async(req,res)=>{
    const job=req.body || {};
    const jobs=await jobsReady;
    const defjob=await defineJob(job,jobs,agenda);
    res.status(200).json({"msg":defjob});
    
};


module.exports={renderHome,createJob};