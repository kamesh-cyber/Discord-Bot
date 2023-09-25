
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = async ()  => {
    console.log('Initializing a new connection to document DB')
    const URI = `mongodb+srv://discordbot:c5llyoBoODPsVMFC@cluster0.nmp7gm4.mongodb.net/?authMechanism=SCRAM-SHA-1`
    const clientPromise = await MongoClient.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true})
   
    return clientPromise
}

module.exports = {
    client: client()
}