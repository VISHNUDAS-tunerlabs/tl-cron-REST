const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const configuration=require('./config');
const router=re

const PORT=configuration.port;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//starting the server at port defined in config.js
app.listen(PORT,()=>{
    console.log(`server started at: http://localhost:${PORT}`);
});