const express=require('express');
const { append } = require('vary');
const router=express.Router();
const {renderHome}=require('../controllers/jobs');


//API routes
router.get('/',renderHome);

module.exports=router;