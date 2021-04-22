const Discord = require('discord.js');
module.exports = {
    name: "ship",
    help: "Ship two people together by providing their names! \`{{p}}ship <name1> <name2>\`",
    meta: {
        category: 'Fun',
        description: "Ship two people together by providing their names! >///<",
        syntax: '`ship <@user1/name1> <@user2/name2>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}ship  <@user1/name1> <@user2/name2>\``);}
        let start; let end;
        if (args.length > 2 && msg.includes(/\s+(?:with|and)\s+/gm)) {
            let targs = args.join(" ").split(/\s+(?:[wW][iI][tT][hH]|[aA][nN][dD])\s+/gm);
            start = message.mentions.members.first() ? message.mentions.members.first().displayName : targs[0];
            end = message.mentions.members.size > 1 ? message.mentions.members.map(m => m.displayName).splice(1) : targs[1];
        } else {
            start = message.mentions.members.first().displayName || args[0];
            end = message.mentions.members.map(m => m.displayName).splice(1) || args[1];
        }
        if (!start || !end || !end.length) {return message.channel.send(`You have to give two people to ship! Ex. \`${prefix}ship Crescent Luno\``);}
        let finalName = start.slice(0, Math.floor(start.length / 2))+end.slice(Math.floor(end.length / 1 + 1));
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${start} & ${end}\'s Ship Name:`)
            .setThumbnail("https://media.discordapp.net/attachments/550550810145325056/834696984605622292/unknown.png?width=551&height=418")
            .setDescription(`:sparkling_heart: ${finalName} :sparkling_heart:`)
            .setColor("d42f66")
            .setFooter("What a cute ship!~", client.user.avatarURL())
        );
    }
}