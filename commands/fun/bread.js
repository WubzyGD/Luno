const Discord = require('discord.js');

module.exports = {
    name: "bread",
    aliases: ['bred'],
    meta: {
        category: 'Fun',
        description: "By making use of the wonderful technological advancements of modern-day 2000's computer code, Luno synthesizes digital bread and gives it to you.",
        syntax: '`bread`',
        extra: null
    },
    help: "bread.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send(":bread:");
    }
};