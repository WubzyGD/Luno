const Discord = require('discord.js');

module.exports = {
    name: "birthday",
    aliases: ["bd"],
    meta: {
        category: 'Misc',
        description: "Shows what Luno's birthday is",
        syntax: '`birthday`',
        extra: null
    },
    help: "Shows what Luno's birthday is",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Luno's Birthday")
            .setDescription(`${["I blessed this world with my presence on", "I was born on", "I was created by Wubzy on"][Math.floor(Math.random() * 3)]} 6/9/2021.`)
            .setThumbnail(client.user.avatarURL({size: 2048}))
            .setColor('328ba8')
            .setFooter("Luno")
            .setTimestamp()
        );
    }
};