const Discord = require('discord.js');

const Mute = require('../../models/mute');

const muted = '834613812271251476';

module.exports = {
    name: "mute",
    aliases: ['m'],
    meta: {
        category: 'Moderation',
        description: "Prevent a user from speaking for a designated amount of time",
        syntax: '`mute <@user|userID> [duration] [reason]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Muting")
    .setDescription("Mutes a user (prevents them from speaking) for a designated amount of time")
    .addField("Permissions", "You must have Manage Messages in your server in order to mute members.")
    .addField("Duration Syntax", "By default, a member will be muted for one hour. However, you can specify <x>m or <x>h to mute a user for a set time. Ex: `mute @user 30m` or `mute @user 2h`. Max is 48h.")
    .addField("Syntax", "`mute <@user|userID> [duration] [reason]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}mute <@user|userID> [duration] [reason]\``);}
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {return message.reply("You need to have Manage Messages permissions in this server to be able to do that.");}
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {return message.reply("I don't have permissions to manage roles in this server, which I need to have in order to mute members.");}
        const person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (message.guild.me.roles.highest.position <= person.roles.highest.position) {return message.reply("I don't have permissions to mute that member, as their highest role is equal to or above mine.");}

        if (person.roles.cache.has(muted)) {return message.reply("That person is already muted!");}
        if (message.guild.roles.cache.get(muted).position <= person.roles.highest.position) {return message.reply("I don't have permissions to mute that member as their highest role is above or equal to the muted role!");}
        if (person.roles.highest.positon >= message.guild.roles.cache.get(muted)) {return message.reply("You can't mute that member as their highest role is higher than the muted role (in other words they are a moderator or admin of the server)");}

        let udur = args[1] ? args[1].toLowerCase().trim() : '1h';
        let time;
        if (args[1]) {
            let dur = args[1].slice(0, args[1].length - 1);
            if (!dur.match(/^\d+$/gm)) {return message.reply("That wasn't a valid time format!");}
            dur = Number(dur)
            let format = args[1].slice(args[1].length - 1).toLowerCase();
            if (!['h', 'm'].includes(format)) {return message.reply("That isn't a valid format for your mute time!");}
            if ((format === 'h' && dur >= 48) || (format === 'm' && dur >= (48 * 60))) {return message.reply("That mute duration is too long! Try again.");}
            time = format === 'h' ? new Date().getTime() + (dur * 1000 * 60 * 60) : new Date().getTime() + (dur * 1000 * 60);
        } else {time = new Date().getTime() + (1000 * 60 * 60);}

        let reason = '';
        if (args[2]) {args.shift(); args.shift(); reason = args.join(" ").trim();}

        try {
            person.roles.add("834613812271251476")
                .then(() => message.channel.send("I've muted that member!")
                    .then(() => message.guild.channels.cache.get('834611202377515018').send(new Discord.MessageEmbed()
                        .setAuthor(message.member.displayName, message.author.avatarURL())
                        .setTitle("Member Muted!")
                        .setDescription(`<@${person.id}> was muted!`)
                        .addField("Duration", udur, true)
                        .addField("Reason", reason.length ? reason : "No reason provided", true)
                        .setColor('c77dff')
                        .setFooter("Luno", client.user.avatarURL())
                        .setTimestamp()
                    ))
                ).catch(() => message.channel.send("There was an error while trying to mute that member. I may not have the correct permissions, or something else went wrong."));
        } catch {}

        let tm = new Mute({uid: person.id, until: time, mutedBy: message.author.id, reason: reason});
        tm.save();

        return client.misc.cache.mute.set(person.id, time);
    }
};