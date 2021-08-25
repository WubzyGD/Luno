const GuildData = require('../models/guild');
const Responses = require('../models/responses');
const sendResponse = require('../util/response/sendresponse');
const Discord = require("discord.js");

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

    if (member.guild.id === client.misc.alt) {return;}

    member.guild.channels.cache.get('857097085915496468').send(new Discord.MessageEmbed()
        .setAuthor(member.displayName, client.users.cache.get(member.id).avatarURL())
        .setTitle("New User's Account Age")
        .setDescription(moment.preciseDiff(moment(client.users.cache.get(member.id).createdAt), moment()))
        .setColor('328ba8')
        .setFooter("Luno")
        .setTimestamp()
    );

    member.guild.channels.cache.get('782727130009698317').send(`Welcome <@${member.id}> to the Crescent's Family Discord Server!`);

    client.users.fetch(member.id).then(user => {
        user.send(new Discord.MessageEmbed()
            .setTitle("Hey there!")
            .setDescription("I'm Luno, the official mascot of the Crescent's Family Discord Server!")
            .addField("To-do", "Now that you're here:\n-Read our <#808069531507228682>,\n-Grab some roles in <#808108692557398096> and <#816145028954849280>,\n\n**-And come say hi in <#782727130009698317>!** Don't be shy!\n\nEnjoy your stay here!")
            .setImage("https://cdn.discordapp.com/attachments/821171356820963328/847608054483910676/20210504_154239.gif")
            .setColor('2c9cb0')
            .setThumbnail(client.guilds.cache.get(client.misc.neptune).iconURL({size: 2048}))
            .setFooter("Luno", client.user.avatarURL())
        );
    }).catch(() => {});

    client.user.setActivity(`over ${client.guilds.cache.get(client.misc.neptune).members.cache.size} members!`, {type: "WATCHING"});
};