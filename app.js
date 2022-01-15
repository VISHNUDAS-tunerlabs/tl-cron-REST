const express=require('express');
const bodyParser=require('body-parser');
const configuration=require('./config');
const router=require('./route/routes');

const app=express();
const PORT=configuration.port;

//middleware definition
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/',router);

//starting the server at port defined in config.js
app.listen(PORT,()=>{
    console.log(`server started at: http://localhost:${PORT}`);
});