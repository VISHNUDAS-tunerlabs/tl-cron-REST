const Agenda=require('agenda');
const configuration=require('../config');


//connect Agenda to default collection--agendaJobs
const agenda=new Agenda({
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
  await agenda.start();
  return jobDefCollection;
});

//Defining agenda job -------------------
const defineJob=async(job,jobs,agenda)=>{
    const{name,url,method,owner,email}=job;
    agenda.define(name, async (job) => {
        await console.log("job is working yeaaaa...");
    });

    await jobs.countDocuments({ name })
      .then((count) =>
      
        count < 1 ? jobs.insertOne(job) : jobs.updateOne({ name }, { $set: job })
      );
  
    return " hey job defined";
};

//scheduling job for every given interval
const scheduleEvery=async(req,agenda)=>{
  const interval=req.body.interval;
  const name=req.body.name;
  await agenda.every(interval,name);
  return "Repeating Job Scheduled"
}; 

//shedule job for immediate exicution
const scheduleNow=async(req,agenda)=>{
  const name=req.body.name;
  await agenda.now(name);
  return "Immediate Job Scheduled"
}

//schedule job for once
const scheduleOnce=async(req,agenda)=>{
  const name=req.body.name;
  const interval=req.body.interval;
  await agenda.schedule(interval,name);
  return "Job Scheduled for given Time"
}

module.exports={defineJob,agenda,jobsReady,scheduleEvery,scheduleNow,scheduleOnce};