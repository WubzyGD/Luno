const Discord = require("discord.js");
const moment = require('moment');
require('moment-precise-range-plugin');

module.exports = async (message, client) => {
    let t = client.misc.queue[message.guild.id].queue[0];
    let length = 0;
    client.misc.queue[message.guild.id].queue.forEach(x => length += x.song.info.length);
    await client.misc.queue[message.guild.id].controller.edit("", new Discord.MessageEmbed()
        .setAuthor("Now Playing", client.users.cache.get(t.player).avatarURL())
        .setTitle(t.song.info.title)
        .setThumbnail(`https://i.ytimg.com/vi/${t.song.info.identifier}/maxresdefault.jpg`)
        .setDescription(`Channel: ${t.song.info.author}\n[Original video](${t.song.info.uri})`)
        .addField("Queued By", `<@${t.player}>`, true)
        .addField("Length", moment.preciseDiff(Date.now(), Date.now() + t.song.info.length), true)
        .addField("Songs in Queue", `**${client.misc.queue[message.guild.id].queue.length}** Song${client.misc.queue[message.guild.id].queue.length > 1 ? 's' : ''}\n${moment.preciseDiff(Date.now(), Date.now() + length)}${client.misc.queue[message.guild.id].queue.length > 1 ? `\n\nNext up: **${client.misc.queue[message.guild.id].queue[1].song.info.title}**` : ''}`)
        .addField("Settings", `Volume: **${client.misc.queue[message.guild.id].volume}**/**150**${client.misc.queue[message.guild.id].player.paused ? '\n**Currently paused.**' : ''}`)
        .setColor('328ba8')
        .setFooter("Luno")
    ).catch(() => {});
};