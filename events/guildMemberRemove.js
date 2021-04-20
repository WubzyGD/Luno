const GuildData = require('../models/guild');
const Responses = require('../models/responses');
const sendResponse = require('../util/response/sendresponse');

module.exports = async (client, member) => {
    let tg = await GuildData.findOne({gid: member.guild.id});
    let tr = await Responses.findOne({gid: member.guild.id});
    if (
        tr && tr.bindings.has('leave') && tr.responses.has(tr.bindings.get('leave'))
        && tg.lch.length && member.guild.channels.cache.has(tg.lch)
        && member.guild.channels.cache.get(tg.lch).permissionsFor(client.user.id).has("SEND_MESSAGES")
        && !client.users.cache.get(member.id).bot
    ) {
        try {member.guild.channels.cache.get(tg.lch).send(await sendResponse(member, member.guild.channels.cache.get(tg.lch), 'xdlol', client, tr.responses.get(tr.bindings.get('leave'))));} catch {}
    }

    let cm = Mute.findOne({uid: member.id});
    if (cm) {
        member.guild.members.ban(member.id)
        .then(() => message.guild.channels.cache.get('830600344668602409').send("<@&828000073203974166>", new Discord.MessageEmbed()
            .setAuthor(member.displayName, client.users.cache.get(member.id).avatarURL())
            .setTitle("Mute Evasion Detected!")
            .setDescription(`<@${member.id}> has evaded their mute, and I've automatically banned them!`)
            .addField("Original Mod", `<@${cm.id}>`)
            .setColor('c77dff')
            .setFooter("Kit", client.user.avatarURL())
            .setTimestamp()
        )).catch(e => {
            console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to ban a member for mute evasion`)}`, e);
            message.guild.channels.cache.get('830600344668602409').send("<@&828000073203974166> **Failed automatic mute evasion ban!**", new Discord.MessageEmbed()
                .setAuthor(member.displayName, client.users.cache.get(member.id).avatarURL())
                .setTitle("Mute Evasion Detected!")
                .setDescription(`<@${member.id}> has evaded their mute, but I was not able to automatically ban them! Their user ID is \`${member.id}\`.`)
                .addField("Original Mod", `<@${cm.id}>`)
                .setColor('c77dff')
                .setFooter("Kit", client.user.avatarURL())
                .setTimestamp()
            );
        });
    }
};