const { jobs } = require('agenda/dist/agenda/jobs');
const {jobsReady,agenda,defineJob,scheduleEvery}=require('./agendaFn');
const{checkRequestBodyJobDefinition,verifydata}=require('./utils');

//controller for '/'
const renderHome=(req,res)=>{
    res.status(200).json({"msg":"server running.."})
};

//API/jobs
const createJob=async(req,res)=>{
    try{
        const job=req.body || {};
        const jobs=await jobsReady;
        const checkBody=await checkRequestBodyJobDefinition(job);
        if(checkBody.result==="green"){
            const checkData=await verifydata(job,jobs);
            if(checkData.result==="green"){
                const defjob=await defineJob(job,jobs,agenda);
                res.status(200).json({"msg":defjob});
            }else{
                res.status(404).json({"msg":checkData.message});
            }   
        }else{
                res.status(400).json({"msg":checkBody.message});
        }
    }catch(err){
        res.status(404).json({"msg":err});
    }
};

//API/jobs/:jobname
const updateJob=async(req,res)=>{
    try{
        const job=req.body || {};
        if(req.params.jobname){
            job.name=req.params.jobname;
        };
        const jobs=await jobsReady;
        const checkBody=await checkRequestBodyJobDefinition(job);
        if(checkBody.result==="green"){
            const checkData=await verifydata(job,jobs);
            if(checkData.result==="red"){
                const defjob=await defineJob(job,jobs,agenda);
                res.status(200).json({"msg":defjob});
            }else{
                res.status(404).json({"msg":checkData.message});
            }   
        }else{
                res.status(400).json({"msg":checkBody.message});
        }
    }catch(err){
        res.status(404).json({"msg":err});
    }
}

//API/jobs/every
const jobEvery=async(req,res)=>{
    //check defined or not........todo
    //check req body format.......todo
    const every=await scheduleEvery(req,agenda);
    res.status(200).json({"msg":every});
};


module.exports={renderHome,createJob,jobEvery,updateJob};