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

//Defining agenda job -------------------
const defineJob=async(job,jobDefCollection,agenda)=>{
    agenda.define("some long running job", async (job) => {
        //define a job function
      });
};

module.exports={defineJob};