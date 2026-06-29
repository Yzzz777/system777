"use client";

import BlogPost from "@/components/BlogPost";

export default function BuildDiscordBotDiscordjs() {
  return (
    <BlogPost
      title="Crea Tu Primer Bot de Discord con Discord.js"
      category="Discord"
      author="System 777"
      date="2025-01-10"
      readTime="15 min"
      content={`
## Introducción

Discord es una de las plataformas de comunicación más populares para comunidades de gaming, desarrollo y tecnología. En esta guía aprenderás a crear tu propio bot de Discord usando Discord.js, la biblioteca más popular de JavaScript para interactuar con la API de Discord.

## Requisitos Previos

- Node.js 18 o superior instalado
- Un editor de código (VS Code recomendado)
- Cuenta de Discord y conocimientos básicos de JavaScript/TypeScript

## Paso 1: Crear la Aplicación en el Portal de Discord

1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications).
2. Haz clic en "New Application" y dale un nombre a tu bot.
3. Ve a la sección "Bot" en el menú lateral.
4. Haz clic en "Add Bot".
5. Desactiva "Public Bot" si quieres que solo tú puedas invocarlo.
6. Copia el **Token** del bot (esto es como tu contraseña, ¡nunca lo compartas!).

\`\`\`
⚠️ IMPORTANTE: El token del bot es secreto. Nunca lo subas a GitHub o lo compartas públicamente.
Si tu token se ve comprometido, regenera inmediatamente desde el portal.
\`\`\`

## Paso 2: Configurar el Proyecto

\`\`\`bash
# Crear carpeta del proyecto
mkdir mi-discord-bot
cd mi-discord-bot

# Inicializar proyecto Node.js
npm init -y

# Instalar Discord.js
npm install discord.js

# (Opcional) Instalar dotenv para variables de entorno
npm install dotenv
\`\`\`

**Estructura del proyecto:**

\`\`\`
mi-discord-bot/
├── src/
│   ├── commands/
│   │   ├── ping.js
│   │   └── userinfo.js
│   ├── events/
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   ├── deploy-commands.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
\`\`\`

## Paso 3: Configurar Variables de Entorno

Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`bash
# .env
DISCORD_TOKEN=TU_TOKEN_AQUÍ
CLIENT_ID=TU_CLIENT_ID_AQUÍ
GUILD_ID=TU_SERVER_ID_AQUÍ  # Opcional: para testing en un servidor específico
\`\`\`

Crea el archivo \`.gitignore\`:

\`\`\`bash
# .gitignore
node_modules/
.env
dist/
\`\`\`

## Paso 4: Crear el Archivo Principal (index.js)

\`\`\`javascript
// src/index.js
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Colección para almacenar comandos
client.commands = new Collection();

// Cargar comandos desde la carpeta commands
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { default: command } = await import(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(\`✅ Comando cargado: /\${command.data.name}\`);
  } else {
    console.log(\`⚠️ El comando en \${file} no tiene "data" o "execute"\`);
  }
}

// Cuando el bot esté listo
client.once('ready', () => {
  console.log(\`🤖 Bot conectado como \${client.user.tag}\`);
  console.log(\`📡 Servidores: \${client.guilds.cache.size}\`);
  client.user.setActivity('Usando /help | System 777', { type: 3 });
});

// Manejar interacciones (slash commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(\`No se encontró el comando \${interaction.commandName}\`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error ejecutando comando:', error);

    const reply = {
      content: '❌ Hubo un error al ejecutar este comando.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// Conectar el bot
client.login(process.env.DISCORD_TOKEN);
\`\`\`

## Paso 5: Crear Slash Commands

### Comando /ping

\`\`\`javascript
// src/commands/ping.js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Muestra la latencia del bot'),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: '🏓 Pinging...',
      fetchReply: true,
    });

    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const websocketHeartbeat = interaction.client.ws.ping;

    await interaction.editReply(
      \`🏓 **Pong!**\\n\` +
      \`│ Latencia de API: \${roundtrip}ms\\n\` +
      \`│ Heartbeat WebSocket: \${websocketHeartbeat}ms\`
    );
  },
};
\`\`\`

### Comando /userinfo

\`\`\`javascript
// src/commands/userinfo.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Muestra información sobre un usuario')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('El usuario del que quieres ver información')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const roles = member.roles.cache
      .filter(role => role.id !== interaction.guild.id)
      .map(role => role.toString())
      .join(', ') || 'Ninguno';

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(\`👤 Información de \${user.username}\`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '📝 Nombre', value: user.tag, inline: true },
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📅 Cuenta creada', value: \`<t:\${Math.floor(user.createdTimestamp / 1000)}:R>\`, inline: true },
        { name: '📥 Se unió al servidor', value: \`<t:\${Math.floor(member.joinedTimestamp / 1000)}:R>\`, inline: true },
        { name: '🎭 Roles', value: roles, inline: false },
        { name: '🤖 Bot', value: user.bot ? 'Sí' : 'No', inline: true },
      )
      .setFooter({ text: \`Solicitado por \${interaction.user.tag}\` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
\`\`\`

### Comando /help

\`\`\`javascript
// src/commands/help.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra todos los comandos disponibles'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('📚 Comandos Disponibles')
      .setDescription('Lista de todos los comandos del bot:')
      .addFields(
        { name: '/ping', value: 'Muestra la latencia del bot', inline: false },
        { name: '/userinfo', value: 'Muestra información de un usuario', inline: false },
        { name: '/help', value: 'Muestra esta lista de comandos', inline: false },
      )
      .setFooter({ text: 'System 777 Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
\`\`\`

## Paso 6: Registrar los Comandos

Los slash commands deben registrarse en Discord antes de poder usarlos. Crea un script para esto:

\`\`\`javascript
// src/deploy-commands.js
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const commands = [];
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(path.join(commandsPath, file));
  if ('data' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('🔄 Registrando slash commands...');

  // Para un servidor específico (recomendado para testing)
  const data = await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  // Para registrar globalmente (tardarán ~1 hora en propagarse)
  // const data = await rest.put(
  //   Routes.applicationCommands(process.env.CLIENT_ID),
  //   { body: commands }
  // );

  console.log(\`✅ \${data.length} comandos registrados exitosamente.\`);
} catch (error) {
  console.error('❌ Error:', error);
}
\`\`\`

**Ejecutar el registro de comandos:**

\`\`\`bash
node src/deploy-commands.js
\`\`\`

## Paso 7: Configurar y Ejecutar el Bot

### Configurar package.json

\`\`\`json
{
  "name": "mi-discord-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "deploy": "node src/deploy-commands.js",
    "dev": "node --watch src/index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "dotenv": "^16.3.1"
  }
}
\`\`\`

### Ejecutar el bot

\`\`\`bash
# Registrar comandos (solo la primera vez o cuando cambies comandos)
npm run deploy

# Iniciar el bot
npm start

# En desarrollo (reinicio automático)
npm run dev
\`\`\`

### Invitar el bot a tu servidor

1. Ve al Portal de Desarrolladores de Discord > Tu Aplicación > OAuth2 > URL Generator.
2. Selecciona los scopes: \`bot\` y \`applications.commands\`.
3. Selecciona los permisos necesarios:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History
4. Copia la URL generada y ábrela en tu navegador.
5. Selecciona el servidor donde quieres invitar el bot.

## Eventos Útiles

### Manejar mensajes (si necesitas eventos de mensajes)

\`\`\`javascript
// En index.js, agregar:
client.on('messageCreate', async (message) => {
  // Ignorar mensajes de bots
  if (message.author.bot) return;

  // Ejemplo: responder cuando mencionan al bot
  if (message.mentions.has(client.user)) {
    await message.reply('¡Hola! Usa /help para ver los comandos disponibles.');
  }

  // Ejemplo: comandos con prefijo (alternativa a slash commands)
  if (message.content === '!ping') {
    await message.reply('🏓 Pong!');
  }
});
\`\`\`

### Sistema de bienvenida

\`\`\`javascript
// En index.js, agregar:
client.on('guildMemberAdd', async (member) => {
  const welcomeChannel = member.guild.channels.cache.find(
    channel => channel.name === 'bienvenidos'
  );

  if (!welcomeChannel) return;

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('🎉 ¡Nuevo miembro!')
    .setDescription(\`¡Bienvenido/a \${member} a **\${member.guild.name}**!\`)
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: \`Miembros totales: \${member.guild.memberCount}\` })
    .setTimestamp();

  welcomeChannel.send({ embeds: [embed] });
});
\`\`\`

## Buenas Prácticas

1. **Usa variables de entorno**: Nunca hardcodees tokens o IDs.
2. **Maneja errores**: Siempre envuelve ejecuciones en try-catch.
3. **Usa intents mínimos**: Solo solicita los intents que realmente necesitas.
4. **Rate limiting**: No envíes demasiados mensajes rápido (usa \`setTimeout\` si es necesario).
5. **Documentación**: Comenta tu código y mantén un README actualizado.
6. **Versionado**: Usa Git para controlar los cambios de tu bot.
7. **Testing**: Prueba en un servidor de desarrollo antes de desplegar en producción.

## Conclusión

Has creado tu primer bot de Discord con slash commands. Ahora puedes expandirlo agregando más comandos, integrando bases de datos, creando sistemas de moderación, o conectándolo a APIs externas. La documentación oficial de Discord.js (discord.js.org) es tu mejor recurso para seguir aprendiendo.

¡Feliz desarrollo! 🤖
      `}
    />
  );
}
