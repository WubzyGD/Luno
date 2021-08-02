const Discord = require('discord.js');

module.exports = {
    name: "clearqueue",
    aliases: ['cq'],
    meta: {
        category: 'Music',
        description: "Clear your music queue",
        syntax: '`clearqueue`',
        extra: null
    },
    help: "Clear your music queue",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command!");}
        if (!client.misc.queue[message.guild.id]) {return message.channel.send("This server doesn't have any music playing!");}
        if (!message.member.voice.channel || !message.member.voice.channel === client.misc.queue[message.guild.id].updates) {return message.channel.send("You're not in the music voice channel!");}

        let ct = client.misc.queue[message.guild.id].queue[0];
        client.misc.queue[message.guild.id].queue = [];
        client.misc.queue[message.guild.id].queue.push(ct);

        require('../../util/updatecontroller')(message, client);
        message.channel.send("Queue cleared!");
    }
};