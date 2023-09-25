const mongo = require('./mongo-client')


exports.main=async()=>{
const client = await mongo.client;
const collection = client.db('discord').collection('points')
await collection.updateOne(
    { name: 'kamesh' },
   { $set: { name: 'kamesh'},
   $inc:{point:1}},
   {upsert:true}
)
await client.db("admin").command({ ping: 1 })
}
this.main()