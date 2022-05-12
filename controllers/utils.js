//const {jobsReady}=require('./agendaFn');
// var sendmail = require('sendmail')({
//     devHost:'localhost',
//     devPort: 1025
// })
const nodemailer = require('nodemailer');
const kafkaCommunication = require('../generics/kafka-communication');


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

//checking req body format for job instance creation
const checkRequestBodyJobInstance=async(job)=>{
    const {name,interval}=job;
    if(!name||!interval){
        return {result:"red",message:"Miss match in request body"};
    }else{
        return {result:"green",message:"success"};
    }
};

//send mail to owner if any error occurs

const sendErrorMail= async( email )=>{
    try {
        console.log("inside send mail :",email)
        // let transport = nodemailer.createTransport({
        //     // host: 'smtp.mailtrap.io',
        //     // port: 2525,
        //     service: "Gmail",
        //     auth: {
        //     //    user: 'df9aa4565abf18',
        //     //    pass: 'be21c4e46699ea'
        //        user: 'vishnudasmcapu@gmail.com',
        //        pass: 'jpjwlxgydcirzkpd'
        //     }
        // });
        // const message = {
        //     from: 'vishnudasmcapu@gmail.com', // Sender address
        //     to: 'vishnu@tunerlabs.com',         // List of recipients
        //     subject: 'Job Failure Report', // Subject line
        //     text: 'Your scheduled task failed. Please contact support team' // Plain text body
        // };
        // transport.sendMail(message, function(err, info) {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       console.log(info);
        //     }
        // });
        const payload = {
            type: "email",
            email: {
                to: email,
                subject: 'Job Failure Report', // Subject line
                body: 'Your scheduled task failed. Please contact support team' // Plain text body
            }
        };

        await kafkaCommunication.pushEmailToKafka(payload);

    } catch (err) {
        console.log("error : ",err)
    }
    
};

module.exports={checkRequestBodyJobDefinition,verifydata,checkRequestBodyJobInstance,sendErrorMail};