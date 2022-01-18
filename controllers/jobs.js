const { jobs } = require('agenda/dist/agenda/jobs');
const {jobsReady,agenda,defineJob,scheduleEvery,scheduleNow,scheduleOnce}=require('./agendaFn');
const{checkRequestBodyJobDefinition,verifydata,checkRequestBodyJobInstance}=require('./utils');

//controller for '/'
const renderHome=(req,res)=>{
    res.status(200).json({"msg":"server running.."})
};

//API/jobs--list jobs
const listJob=async(req,res)=>{
    try{
        const list=await jobsReady.then((jobs) => jobs.toArray());
        res.status(200).json({"jobs":list});
    }catch(err){
        res.status(400).json({"error":err});
    }  
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
    try{
        job=req.body||{};
        const jobs=await jobsReady;
        const checkBody=await checkRequestBodyJobInstance(job);
        if(checkBody.result==="green"){
            const checkData=await verifydata(job,jobs);
            if(checkData.result==="red"){
                const every=await scheduleEvery(req,agenda);
                res.status(200).json({"msg":every});
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

//API/jobs/now
const jobNow=async(req,res)=>{
    try{
        job=req.body||{};
        const jobs=await jobsReady;
        if(req.body.name){
            const checkData=await verifydata(job,jobs);
            if(checkData.result==="red"){
                const now=await scheduleNow(req,agenda);
                res.status(200).json({"msg":now});
            }else{
                res.status(404).json({"msg":checkData.message});
            }   
        }else{
                res.status(400).json({"msg":"invalid request body"});
        }
    }catch(err){
        res.status(404).json({"msg":err});
    }

};

//API/jobs/once
const jobOnce=async(req,res)=>{
    try{
        job=req.body||{};
        const jobs=await jobsReady;
        const checkBody=await checkRequestBodyJobInstance(job);
        if(checkBody.result==="green"){
            const checkData=await verifydata(job,jobs);
            if(checkData.result==="red"){
                const once=await scheduleOnce(req,agenda);
                res.status(200).json({"msg":once});
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

//API/cancel
const jobCancel=async(req,res)=>{
    try{
        if(req.body.name){
            const numCancel=await agenda.cancel({name:req.body.name});
            numCancel>0 ? res.status(200).json({"msg":`${numCancel} job instace cancelled`}) : res.status(400).json({"msg":`no job instance exist in the specified name`});
        }else{
            const numCancel=await agenda.cancel();
            res.status(200).json({"msg":`${numCancel} job instace cancelled to clean the collection`});
        }
    }catch(err){
        res.status(404).json({"msg":err});
    }
    
};

//API/delete
const jobDelete=async(req,res)=>{
    try{
        const job=req.body || {};
        if(req.params.jobname){
            job.name=req.params.jobname;
        };
        const jobs=await jobsReady;
        const checkdata=await verifydata(job,jobs);
        if(checkdata.result==="red"){
            await agenda.cancel({name:job.name});
            await jobs.deleteOne({name:job.name});
            res.status(200).json({"msg":"job removed from definition"})
        }else{
            res.status(400).json({"msg":"matching job definition not found"});
        }
    }catch(err){
        res.status(400).json({"msg":"error: could't delete the job"});
    }
}

module.exports={renderHome,createJob,jobEvery,updateJob,listJob,jobNow,jobOnce,jobCancel,jobDelete};