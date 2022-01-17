const express=require('express');
const { append } = require('vary');
const router=express.Router();
const {renderHome,createJob,jobEvery,updateJob}=require('../controllers/jobs');


//API routes
router.get('/',renderHome);
router.post('/jobs',createJob);
router.post('/jobs/every',jobEvery);
router.put('/jobs/:jobname',updateJob);


module.exports=router;