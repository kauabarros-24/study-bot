require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log("Login realizado com o PotasBot");
});

client.on('messageCreate', message => {
    if (message.content === "/PING") {
        message.channel.send("PONG!");
    }
});

client.login(process.env.TOKEN);
