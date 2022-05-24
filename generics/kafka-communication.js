/**
 * name : generics/kafka-communication
 * author : Vishnudas
 * Date : 12-may-2022
 * Description : Kafka producer methods
*/

const pushEmailToKafka = async message => {
    try {
        let thetopic= process.env.NOTIFICATION_KAFKA_TOPIC
        console.log("reached here",message,thetopic )
        const payload = [{ topic: "notificationtopic", messages: JSON.stringify(message) }];
        return await pushPayloadToKafka(payload)
    } catch (error) {
        console.log("pushmail error: ",error)
        throw error;
    }
};

const pushPayloadToKafka = (payload) => {
    return new Promise((resolve, reject) => {
        kafkaProducer.send(payload, (error, data) => {
            if (error) {
                console.log("send error : ",error)
                reject(error);
            }
            console.log("data : ",data)
            resolve(data);
        });
    });
};

module.exports = {
    pushEmailToKafka
};