const {Client, Events, GatewayIntentBits} = require('discord.js')
const dotenv = require('dotenv').config()


//Novo cliente:
const client = new Client({intents: [GatewayIntentBits.Guilds]});

//Inciar aplicação:
client.once(Events.ClientReady, readyClient => {
    console.log(`Bot logado em ${readyClient.user.tag}`);
});

//Efetuar o login:
client.login(process.env.TOKEN);

//Registro de interações
client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return
    
});
