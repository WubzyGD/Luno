const Discord = require('discord.js');

const updateController = require('../../util/updatecontroller');

module.exports = {
    name: "skip",
    aliases: ['s'],
    meta: {
        category: 'Music',
        description: "Skips the currently-playing song",
        syntax: '`skip [count]`',
        extra: null
    },
    help: "Skips the currently-playing song",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command!");}
        if (!client.misc.queue[message.guild.id]) {return message.channel.send("This server doesn't have any music playing!");}
        if (!message.member.voice.channel || !message.member.voice.channel === client.misc.queue[message.guild.id].updates) {return message.channel.send("You're not in the music voice channel!");}
        
        let skips = 0;

        async function skip() {
            client.misc.queue[message.guild.id].queue.shift();
            skips++;

            if (!client.misc.queue[message.guild.id].queue.length) {
                await client.lavacordManager.leave(message.guild.id);
                message.guild.channels.cache.get(client.misc.queue[message.guild.id].updates).send('Finished playing.');
                delete client.misc.queue[message.guild.id];
                return false;
            }
            return true;
        }

        if (args[0] && (isNaN(Number(args[0])) || Number(args[0]) < 1)) {return message.channel.send("You must specify a positive number of songs to delete!");}
        if (args[0] && Number(args[0]) > 50) {return message.channel.send("That's too big of a number!");}
        let count = args[0] ? Number(args[0]) : 1;
        for (let i=0; i < count; i++) {if (!skip()) {break;}}

        await message.channel.send(`Skipped ${skips} song${skips === 1 ? '' : 's'}!`);
        await client.misc.queue[message.guild.id].player.play(client.misc.queue[message.guild.id].queue[0].song.track);
        await updateController(message, client);
    }
};