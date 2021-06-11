const Discord = require('discord.js');

const Mute = require('../../models/mute');

const muted = '816560107616731137';

module.exports = {
    name: "unmute",
    aliases: ['um'],
    meta: {
        category: 'Moderation',
        description: "End a user's mute",
        syntax: '`unmute <@user|userID>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Unmuting")
    .setDescription("Unmutes a user")
    .addField("Permissions", "You must have Manage Messages in your server in order to unmute members.")
    .addField("Syntax", "`unmute <@user|userID>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}unmute <@user|userID>\``);}
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {return message.reply("You need to have Manage Messages permissions in this server to be able to do that.");}
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {return message.reply("I don't have permissions to manage roles in this server, which I need to have in order to unmute members.");}
        const person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!person) {return message.channel.send("I can't find that member!");}
        if (message.guild.me.roles.highest.position <= person.roles.highest.position) {return message.reply("I don't have permissions to unmute that member, as their highest role is equal to or above mine.");}

        if (person.roles.highest.positon >= message.guild.roles.cache.get(muted)) {return message.reply("You can't unmute that member as their highest role is higher than the muted role (in other words they are a moderator or admin of the server)");}

        let tm = await Mute.findOne({uid: person.id});
        if (!tm) {if (client.misc.cache.mute.has(person.id)) {client.misc.cache.mute.delete(person.id);} return message.channel.send("That person isn't muted!");}

        try {
            person.roles.remove("816560107616731137")
                .then(() => message.channel.send("I've unmuted that member!")
                    .then(() => message.guild.channels.cache.get('807471984806985729').send(new Discord.MessageEmbed()
                        .setAuthor(message.member.displayName, message.author.avatarURL())
                        .setTitle("Member Unmuted!")
                        .setDescription(`<@${person.id}> was muted!`)
                        .addField("Reason for mute", tm.reason.length ? tm.reason : "No reason provided", true)
                        .setColor('c77dff')
                        .setFooter("Luno", client.user.avatarURL())
                        .setTimestamp()
                    ))
                ).catch(() => message.channel.send("There was an error while trying to mute that member. I may not have the correct permissions, or something else went wrong."));
        } catch {}

        await Mute.deleteOne({uid: person.id});

        return client.misc.cache.mute.delete(person.id);
    }
}