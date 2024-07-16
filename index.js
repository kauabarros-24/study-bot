//Básico para configuração
require('dotenv').config()
const discord = require('discord.js')
const client = new discord.Client({
    intents: [
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILDS_MESSAGES
    ]
})
const token = process.env.TOKEN

//Realizar o logind
const isBotLoggedI = () => {
    return client.readyAt !== null && client.readyAt !== undefined;
}

client.once('ready', () => {
    console.log("O Bot está pronto");
    console.log(`Logado com ${client.user.tag}`)
    console.log('Status de login: ', isBotLoggedI())
})

client.login(token)
