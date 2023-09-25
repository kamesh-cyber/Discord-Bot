const eris = require('eris');
const ExcelJS = require('exceljs');
const fs = require('fs');
const mongo = require('./mongo-client')
// Create a Client instance with our bot token.
const bot = new eris.Client('MTE1MzE5MTYyMDI4NDUyMjU0Ng.GzE1Ki.OfRrKx4XcAf-neaO0pPhaIxy_Jmj54eQiaujeQ');
const BOT_OWNER_ID = '551755090273501205'

const PREFIX = 'm!'
const commandForName = {};
exports.addData=async(mention)=>{
    const client = await mongo.client;
    const collection = client.db('discord').collection('points')
    collection.updateOne(
        { name: mention },
       { $set: { name: mention},
       $inc:{point:1}},
       {upsert:true}
    )
}
exports.getData=async(mention)=>{
    const client = await mongo.client;
    const collection = client.db('discord').collection('points')
    const output = await collection.find({}).sort( { point : -1} )
    return output.toArray()

}
commandForName['add'] = {
    botOwnerOnly: true,
    execute: (msg, args) => {
        const mention = args[0];
        const amount = parseFloat(args[1]);
        
        exports.addData(mention)

        return msg.channel.createMessage(`${mention} got ${amount} point(s)`);
    },
  };
  commandForName['leaderboard'] = {
    execute: async(msg) => {
       output =  await exports.getData()
       let string =''
       for (let index = 0; index < output.length; index++) {
        const element = output[index];
        string = string + element.name +' '+element.point+'\n'
       }
       return msg.channel.createMessage(`${string}`);
    },
  };
// When the bot is connected and ready, log to console.
bot.on('ready', () => {
   console.log('Connected and ready.');
});

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
bot.on('messageCreate', async (msg) => {
    try {
        const content = msg.content;
        // Ignore any messages sent as direct messages.
        // The bot will only accept commands issued in
        // a guild.
        if (!msg.channel.guild) {
            return;
        }
  
        // Ignore any message that doesn't start with the correct prefix.
        if (!content.startsWith(PREFIX)) {
            return;
        }
  
        // Extract the parts and name of the command
        const parts = content.split(' ').map(s => s.trim()).filter(s => s);
        const commandName = parts[0].substr(PREFIX.length);
  
        // Get the requested command, if there is one.
        const command = commandForName[commandName];
        if (!command) {
            return;
        }
        const authorIsBotOwner = msg.author.id == BOT_OWNER_ID;
        if(!authorIsBotOwner && command.botOwnerOnly){
            return await msg.channel.createMessage('Hey, only owner can issue ADD command!');
        }

        // Separate the command arguments from the command prefix and name.
        const args = parts.slice(1);
  
        // Execute the command.
        await command.execute(msg, args);
    } catch (err) {
        console.warn('Error handling message create event');
        console.warn(err);
    }
  });
  

bot.on('error', err => {
   console.warn(err);
});

bot.connect();