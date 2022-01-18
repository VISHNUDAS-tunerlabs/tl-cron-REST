const express=require('express');
const { append } = require('vary');
const router=express.Router();
const {renderHome,createJob,jobEvery,updateJob,listJob,jobNow,jobOnce,jobCancel,jobDelete}=require('../controllers/jobs');


//API routes
router.get('/',renderHome);
router.get('/jobs',listJob);
router.post('/jobs',createJob);
router.post('/jobs/every',jobEvery);
router.put('/jobs/:jobname',updateJob);
router.post('/jobs/now',jobNow);
router.post('/jobs/once',jobOnce);
router.post('/jobs/cancel',jobCancel);
router.delete('/jobs/:jobname',jobDelete);


module.exports=router;