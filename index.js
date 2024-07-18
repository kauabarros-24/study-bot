const { Client, Events, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { GUILD_ID, CLIENT_ID, TOKEN } = process.env;

if (!GUILD_ID || !CLIENT_ID || !TOKEN) {
    console.error('Uma ou mais variáveis de ambiente não estão definidas.');
    process.exit(1);
}

console.log(`GUILD_ID: ${GUILD_ID}`);
console.log(`CLIENT_ID: ${CLIENT_ID}`);
console.log(`TOKEN: ${TOKEN ? '********' : 'undefined'}`);

// Novo cliente:
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
console.log(`Lendo diretório de comandos: ${commandsPath}`);

try {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log(`Arquivos de comando encontrados: ${commandFiles}`);
    
    // Procurar os comandos:
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        console.log(`Carregando comando: ${filePath}`);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`A tentativa de executar o comando ${file} falhou`);
        }
    }
} catch (error) {
    console.error(`Erro ao ler diretórios de comandos: ${error.message}`);
}

// Iniciar aplicação:
client.once(Events.ClientReady, readyClient => {
    console.log(`Bot logado em ${readyClient.user.tag}`);
});

// Efetuar o login:
client.login(TOKEN);

// Receber interações de comando
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error("Comando não encontrado");
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Houve um erro enquanto o código estava sendo executado", ephemeral: true });
        } else {
            await interaction.reply({ content: "Houve um erro enquanto o código estava sendo executado", ephemeral: true });
        }
    }
});

const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`Iniciando registro de ${commands.length} comandos`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), 
            { body: commands }
        );
        console.log("Todos os comandos registrados com sucesso! 🎉");
    } catch (error) {
        console.error(error);
    }
})();
