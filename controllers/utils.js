const {jobsReady}=require('./agendaFn');

//checking body format of the request body
const checkRequestBodyJobDefinition=async(job)=>{
    const{name,url,method,owner,email}=job;
    if(!name||!url||!method||!owner||!email){
        return {result:"red",message:"Miss match in request body"};
    }else{
        return {result:"green",message:"success"};
    }
};

//checking presents of data in jobDefinition collection
const verifydata=async(job,jobs)=>{
    const count=await jobs.countDocuments({name:job.name});
    if(count===0){
        return {result:"green",message:"error: Job definition not found"};
    }else{
        return {result:"red",message:"error: Job definition with same name already exist"};
    }
};

module.exports={checkRequestBodyJobDefinition,verifydata};