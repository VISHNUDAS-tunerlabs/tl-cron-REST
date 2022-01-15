const express=require('express');
const bodyParser=require('body-parser');
const configuration=require('./config');
const router=require('./route/routes');
const Agenda=require('agenda');
const {defineJob}=require('./controllers/agendaFn')

const app=express();
const PORT=configuration.port;


//middleware definition
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/',router);

//connect Agenda to default collection
global.agenda=new Agenda({
    db:{
        address:configuration.mongourl,
        collection:configuration.collection?configuration.collection:undefined
    }

});


//restart agenda instances when server restarts
const jobsReady = agenda._ready.then(async () => {
    const jobDefCollection = agenda._mdb.collection(configuration.definition);

    jobDefCollection.toArray = () => {
        const jobsCursor = jobDefCollection.find();
        return (jobsCursor.toArray).bind(jobsCursor)();
    };
    await jobDefCollection
      .toArray()
      .then((jobsArray) =>
        Promise.all(jobsArray.map((job) => defineJob(job, jobDefCollection, agenda)))
      );
    //console.log(agenda);
    await agenda.start();
    return jobDefCollection;
});


//starting the server at port defined in config.js
const server=app.listen(PORT,()=>{
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