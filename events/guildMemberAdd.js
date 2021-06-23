const GuildData = require('../models/guild');
const Responses = require('../models/responses');
const sendResponse = require('../util/response/sendresponse');

const moment = require('moment');
require('moment-precise-range-plugin');

module.exports = async (client, member) => {
    let tg = await GuildData.findOne({gid: member.guild.id});
    let tr = await Responses.findOne({gid: member.guild.id});
    if (tg && tg.joinrole.length && member.guild.roles.cache.has(tg.joinrole)) {
        if (member.guild.members.cache.get(client.user.id).permissions.has("MANAGE_ROLES")) {member.roles.add(tg.joinrole);}
    }
    if (
        tr && tr.bindings.has('welcome') && tr.responses.has(tr.bindings.get('welcome'))
        && tg.wch.length && member.guild.channels.cache.has(tg.wch)
        && member.guild.channels.cache.get(tg.wch).permissionsFor(client.user.id).has("SEND_MESSAGES")
        && !client.users.cache.get(member.id).bot
    ) {
        try {member.guild.channels.cache.get(tg.wch).send(await sendResponse(member, member.guild.channels.cache.get(tg.wch), 'xdlol', client, tr.responses.get(tr.bindings.get('welcome'))));} catch {}
    }

    member.guild.channels.cache.get('857097085915496468').send(new Discord.MessageEmbed()
        .setTitle("Uptime")
        .setDescription(moment.preciseDiff(moment(client.users.cache.get(member).createdAt), moment()))
        .setColor('328ba8')
        .setFooter("Luno")
        .setTimestamp()
    );

    client.user.setActivity(`over ${client.guilds.cache.get(client.misc.neptune).members.cache.size} members!`, {type: "WATCHING"});
};