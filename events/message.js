const Discord = require('discord.js');
const chalk = require('chalk');

const wait = require('../util/wait');

const UserData = require('../models/user');
const AR = require('../models/ar');
const LXP = require('../models/localxp');
const Monners = require('../models/monners');

module.exports = async (client, message) => {
    if (message.author.bot) {return undefined;}
	if (message.channel.type !== 'text' && message.channel.type !== 'dm' && message.channel.type !== "news") {return undefined;}

	//if (message.channel.type == "text") {if (settings[message.guild.id]) {prefix = settings[message.guild.id].prefix;};};

    if (message.guild && !message.member.permissions.has("SEND_MESSAGES")) {return undefined;}
	
    let prefix = message.guild ? client.guildconfig.prefixes.has(message.guild.id) ? client.guildconfig.prefixes.get(message.guild.id) !== null ? client.guildconfig.prefixes.get(message.guild.id) : 'l.' : 'l.' : 'l.';

	let msg = message.content.toLowerCase();
	let mention = message.mentions.users.first();
    let args = msg.startsWith(prefix)
        ? message.content.slice(prefix.length).trim().split(/\s+/g)
        : msg.startsWith('<@!') 
            ? message.content.slice(4 + client.user.id.length).trim().split(/\s+/g)
            : message.content.slice(3 + client.user.id.length).trim().split(/\s+/g);
	let cmd = args.shift().toLowerCase().trim();

    if (message.content.includes("@everyone")) {return;}

	if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(msg)) {
	    return message.channel.send(new Discord.MessageEmbed()
        .setTitle(["Yep, that's me!", "^^ Hiya!", "Oh, hi there!", "Sure, what's up?", "How can I help!", "Luno is busy, but I can take a message for you!", "Teehee that's me!", "You were looking for Luno Tivastl, right?", "Sure! What's up?", "Pong!"][Math.floor(Math.random() * 10)])
        .setDescription(`My prefix here is \`${prefix}\`. Use \`${prefix}help\` to see what commands you can use.`)
        .setColor('328ba8'));
    }

	if (mention && message.guild) {require('../util/mention')(message, msg, args, cmd, prefix, mention, client);}
    UserData.findOne({uid: message.author.id}).then(async (tu) => {
	if (tu && tu.statusmsg.length && tu.statusclearmode === 'auto') {
        tu.statusmsg = '';
        tu.statustype = '';
        tu.save();
        require('../util/siftstatuses')(client, message.author.id, true);
        message.reply('Hey there! You asked me to clear your status when you send a message next, so I went ahead and did that for you.').then(m => {m.delete({timeout: 5000});});
	}});

	if (message.guild && client.misc.cache.ar.has(message.guild.id) && client.misc.cache.ar.get(message.guild.id).includes(msg.trim()) && !(client.misc.cache.arIgnore.has(message.guild.id) && client.misc.cache.arIgnore.get(message.guild.id).includes(message.channel.id))) {
	    AR.findOne({gid: message.guild.id}).then(ar => {
	        if (ar && ar.triggers.length && ar.triggers.includes(msg.trim())) {require('../util/response/filterresponse')(message.member, client, ar.ars[ar.triggers.indexOf(msg.trim())]).then(t => (message.channel.send(t)));}
	    });
	}

	if (message.guild && client.misc.cache.lxp.enabled.includes(message.guild.id)) {
        if (!client.misc.cache.lxp.xp[message.guild.id] || !client.misc.cache.lxp.xp[message.guild.id][message.author.id]) {
            let xp = await LXP.findOne({gid: message.guild.id});
            if (!client.misc.cache.lxp.xp[message.guild.id]) {client.misc.cache.lxp.xp[message.guild.id] = {};}
            if (!client.misc.cache.lxp.xp[message.guild.id][message.author.id]) {client.misc.cache.lxp.xp[message.guild.id][message.author.id] = {
                xp: xp.xp[message.author.id] ? xp.xp[message.author.id][0] : 0,
                level: xp.xp[message.author.id] ? xp.xp[message.author.id][1] : 1,
                lastXP: new Date().getTime() - 60000
            };}
        }
            
        if (!client.misc.cache.monners[message.author.id]) {
            //console.log("\nMESSAGE/CACHE || User not cached: " + message.member.displayName);
            let tmonners = await Monners.findOne({uid: message.author.id}) || new Monners({uid: message.author.id});
            //console.log(`MESSAGE/CACHE || Caching. User ${tmonners.currency ? chalk.greenBright('has') : chalk.redBright("doesn't have")} currency field.`)
            //if (tmonners.currency) {console.log(`MESSAGE/CACHE || Found ${tmonners.currency} monners`);}
            client.misc.cache.monners[message.author.id] = tmonners.currency;
            //console.log(`MESSAGE/CACHE || Cached ${client.misc.cache.monners[message.author.id]} monners`);
        }

        if (new Date().getTime() - client.misc.cache.lxp.xp[message.guild.id][message.author.id].lastXP > 60000) {
            require('../util/lxp/gainxp')(client, message.member.id, message.channel);
        }
    }


    if (message.guild && message.channel.id === "815709333107114043") {return require('../util/newpartner.js')(message, client);}



    try {
        if (msg.startsWith(prefix) || msg.startsWith(`<@${client.user.id}>`) || msg.startsWith(`<@!${client.user.id}>`)) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

            if (command && command.name !== "blacklist") {
                if (message.guild && client.misc.cache.bl.guild.includes(message.guild.id)) {return message.channel.send("Your server has been blacklisted from using my commands! Shame, tsk tsk");}
                if (client.misc.cache.bl.user.includes(message.author.id)) {return message.channel.send("You've been blacklisted from using my commands! Now what'd ya do to deserve that??");}
            }

            if (!command) {let trigger; for (trigger of client.responses.triggers) {if (await trigger[1](message, msg, args, cmd, prefix, mention, client)) {await client.responses.commands.get(trigger[0]).execute(message, msg, args, cmd, prefix, mention, client); break;}} return;}
            message.channel.startTyping();
            await wait(800);
            message.channel.stopTyping();
            if (command.meta && command.meta.guildOnly && !message.guild) {return message.channel.send("You must be in a server to use this command!");}
            require('../util/oncommand')(message, msg, args, cmd, prefix, mention, client);
            if (client.misc.loggers.cmds) {client.misc.loggers.cmds.send(`${chalk.gray("[CMDL]")} >> ${chalk.white("Command")} ${chalk.blue(command.name)} ${message.guild ? `|| ${chalk.blue("Guild ID: ")} ${chalk.blueBright(message.guild.id)}` : ''} || ${chalk.blue("User ID: ")} ${chalk.blueBright(message.author.id)}`);}
            return command.execute(message, msg, args, cmd, prefix, mention, client);
        }
        let trigger; for (trigger of client.responses.triggers) {if (await trigger[1](message, msg, args, cmd, prefix, mention, client)) {await client.responses.commands.get(trigger[0]).execute(message, msg, args, cmd, prefix, mention, client); break;}}
    } catch (e) {
        let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | In ${message.guild ? message.guild.name : `a DM with ${message.author.username}`}\n`)}`, e);
    }
};