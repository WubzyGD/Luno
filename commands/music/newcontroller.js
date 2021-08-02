const Discord = require('discord.js');
const moment = require('moment');
require('moment-precise-range-plugin');

const activateControls = require('../../util/actmusiccont');
const updateController = require('../../util/updatecontroller');

module.exports = {
    name: "newcontroller",
    aliases: ['ncont', 'nc'],
    meta: {
        category: 'Music',
        description: "Create a new music controller to replace the old one in case it gets buried in chat",
        syntax: '`newcontroller`',
        extra: null
    },
    help: "Create a new music controller to replace the old one in case it gets buried in chat",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command!");}
        if (!client.misc.queue[message.guild.id]) {return message.channel.send("This server doesn't have any music playing!");}
        if (!message.member.voice.channel || !message.member.voice.channel === client.misc.queue[message.guild.id].updates) {return message.channel.send("You're not in the music voice channel!");}
        
        client.misc.queue[message.guild.id].controller = await message.channel.send("One moment...");
        await require('../../util/wait')(500);
        updateController(message, client);
        
        let reactions = ['⏯️', '⏭️', '⏹️', '🔁', '🔉', '🔊'];
        for (let i = 0; i < reactions.length; i++) {await client.misc.queue[message.guild.id].controller.react(reactions[i]);}
        activateControls(client.misc.queue[message.guild.id].controller, client);
    }
};