const Discord = require('discord.js');

module.exports = {
    name: "pause",
    aliases: ['pa', 'res', 'resume'],
    meta: {
        category: 'Music',
        description: "Pause/play the current song",
        syntax: '`pause`',
        extra: null
    },
    help: "Pause/play the current song",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command!");}
        if (!client.misc.queue[message.guild.id]) {return message.channel.send("This server doesn't have any music playing!");}
        if (!message.member.voice.channel || !message.member.voice.channel === client.misc.queue[message.guild.id].updates) {return message.channel.send("You're not in the music voice channel!");}
        
        await client.misc.queue[message.guild.id].player.pause(!client.misc.queue[message.guild.id].player.paused);
        require('../../util/updatecontroller')(message, client);
        return message.channel.send(`${client.misc.queue[message.guild.id].player.paused ? "Paused your music." : "Resuming the tunes <a:NC_happy:830701612426199040>"}`);
    }
};