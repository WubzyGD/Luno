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

        const start = message.mentions.members.first().user.username || args[0];
        const end = message.mentions.members.map(m => m.user.username).splice(1) || args[1];
        if (!start && !end || !start || !end) return message.channel.send(this.help);
        let finalName = start.slice(0, Math.floor(start.length / 2))+end.slice(Math.floor(end.length / 1 + 1));
        const Embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setThumbnail("https://media.discordapp.net/attachments/550550810145325056/834696984605622292/unknown.png?width=551&height=418")
        .setTitle(start + ` & ` + end + `\'s Ship Name:`)
        .setDescription(":sparkling_heart: "+finalName+" :sparkling_heart:")
        .setFooter("What a cute ship!~")
        message.channel.send(Embed);
    }
}