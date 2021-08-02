const Discord = require('discord.js');
const moment = require('moment');
require('moment-precise-range-plugin');

const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "queue",
    aliases: ['q'],
    meta: {
        category: 'Music',
        description: "View your music queue",
        syntax: '`queue`',
        extra: null
    },
    help: "View your music queue",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command!");}
        if (!client.misc.queue[message.guild.id]) {return message.channel.send("This server doesn't have any music playing!");}

        let queue = client.misc.queue[message.guild.id].queue;
        if (queue.length > 10) {
            let pages = [];
            let x = 0;
            while (true) {
                let cond = false;
                let page = '';
                for (let i = 0; i < 10; i++) {
                    if (queue[(x * 10) + i] === undefined) {cond = true; break;}
                    page += `**${(x * 10) + i + 1}.** **${queue[(x * 10) + i].song.info.title}** - ${queue[(x * 10) + i].song.info.author}\n<@${queue[(x * 10) + i].player}> | ${moment.preciseDiff(Date.now(), Date.now() + queue[(x * 10) + i].song.info.length)}\n`;
                    if ((x * 10) + i >= queue.length) {cond = true; break;}
                }
                pages.push(new Discord.MessageEmbed()
                    .setTitle(`Server Music Queue [${(x * 10) + 1}-${(x * 10) + 10} of ${queue.length}]`)
                    .setThumbnail(message.guild.iconURL({size: 2048}))
                    .setDescription(page)
                    .setColor('2c9cb0')
                    .setFooter("Kit", client.user.avatarURL())
                    .setTimestamp()
                );
                if (cond) {break;}
                x++;
            }
            let queueList = new Pagination(message.channel, pages, message, client, true);
            return queueList.start({user: message.author.id, endTime: 60000});
        } else {
            let page = '';
            for (let i = 0; i < queue.length; i++) {page += `**${i + 1}.** **${queue[i].song.info.title}** - ${queue[i].song.info.author}\n<@${queue[i].player}> | ${moment.preciseDiff(Date.now(), Date.now() + queue[i].song.info.length)}\n`;}
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Server Music Queue - ${queue.length}`)
                .setThumbnail(message.guild.iconURL({size: 2048}))
                .setDescription(page)
                .setColor('2c9cb0')
                .setFooter("Kit", client.user.avatarURL())
                .setTimestamp()
            );
        }
    }
};