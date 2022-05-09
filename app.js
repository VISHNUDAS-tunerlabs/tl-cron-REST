const express = require('express');
const bodyParser = require('body-parser');
const configuration = require('./config');
const router = require('./route/routes');
//const Agenda=require('agenda');
const {defineJob,agenda,jobsReady} = require('./controllers/agendaFn')

const app = express();
const PORT = configuration.port;


//middleware definition
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/',router);

agenda;
jobsReady;


//starting the server at port defined in config.js
const server=app.listen( PORT,()=> {
    console.log(`server started at: http://localhost:${PORT}`);
});

async function graceful() {
    console.log("\nClosing server...");
    await server.close();
    console.log("Shutting down gracefully...");
    await agenda.stop();
    process.exit(0);
  }
  
  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);