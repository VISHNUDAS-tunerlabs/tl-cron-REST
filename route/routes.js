const express=require('express');
const { append } = require('vary');
const router=express.Router();
const {renderHome,createJob}=require('../controllers/jobs');


//API routes
router.get('/',renderHome);
router.post('/jobs',createJob);

module.exports=router;