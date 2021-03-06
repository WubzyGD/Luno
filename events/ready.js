const Discord = require('discord.js');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');
const ora = require('ora');
const Lavalink = require('@lavacord/discord.js');

const GuildSettings = require('../models/guild');
const BotDataSchema = require('../models/bot');
const LogData = require('../models/log');
const Mute = require('../models/mute');

const siftStatuses = require('../util/siftstatuses');
const localXPCacheClean = require('../util/lxp/cacheloop');

let prefix = 'l.';

module.exports = async client => {
	const config = client.config;

	/*let db = mongoose.connection;
	await db.guild.update({}, {"$set": {'prefix': ''}}, false, true);*/

    console.log(`\n${chalk.green('[BOOT]')} >> [${moment().format('L LTS')}] -> ${chalk.greenBright("Connected to Discord")}.`);
    let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
    console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.white(`Logged in at ${date}.`)}`);
    console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.white(`Logged in as ${client.user.username}!`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Client ID: ${client.user.id}`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Running on ${client.guilds.cache.size} servers!`)}`);
	console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Serving ${client.users.cache.size} users!`)}`);

	client.user.setActivity(`over ${client.guilds.cache.get(client.misc.neptune).members.cache.size} members!`, {type: "WATCHING"});

	const setPL = async () => {let tg; for (tg of Array.from(client.guilds.cache.values)) {
		let tguild = await GuildSettings.findOne({gid: tg.id});
		if (tguild && tguild.prefix && tguild.prefix.length) {client.guildconfig.prefixes.set(tg.id, tguild.prefix);}
		let tl = await LogData.findOne({gid: tg.id});
		if (tl) {
			let keys = Object.keys(tl);
			let k; for (k of keys) {if (typeof tl[k] === "string" && tl[k].length) {
				if (!client.guildconfig.logs.has(tg.id)) {client.guildconfig.logs.set(tg.id, new Map());}
				client.guildconfig.logs.get(tg.id).set(k, tl[k]);
			}}
		}
	}};
	setPL();

	const muteLoop = async () => {
	    let ct = new Date().getTime();
	    let mute; for (mute of Array.from(client.misc.cache.mute.keys())) {
	        if (ct >= client.misc.cache.mute.get(mute)) {
				if (client.guilds.cache.get(client.misc.neptune).members.cache.has(mute)) {
					let mutedata = await Mute.findOne({uid: mute});
					client.guilds.cache.get(client.misc.neptune).members.cache.get(mute).roles.remove('816560107616731137')
						.then(() => {
							let muten = client.guilds.cache.get(client.misc.neptune).members.cache.get(mute).displayName;
							client.guilds.cache.get(client.misc.neptune).channels.cache.get('807471984806985729').send(new Discord.MessageEmbed()
								.setTitle("Member Automatically Unmuted")
								.setDescription(`<@${mute}>${muten.endsWith('s') ? "'" : "'s"} mute time has ended, and I've unmuted them.`)
								.addField("Muting Moderator", `<@${mutedata.mutedBy}>`, true)
								.addField("Reason", mutedata.reason.length ? mutedata.reason : 'No reason provided', true)
								.setColor('c77dff')
								.setFooter("Luno", client.user.avatarURL())
								.setTimestamp()
							);
						});
					}
	            await Mute.deleteOne({uid: mute});
				client.misc.cache.mute.delete(mute);
	        }
	    }
	}
	muteLoop();
	setInterval(muteLoop, 60000);

	siftStatuses();
	setInterval(() => {setPL(); siftStatuses(client, null);}, 120000);

	await require('../util/cache')(client);

	setInterval(() => localXPCacheClean(client), 150000);

	client.lavacordManager = new Lavalink.Manager(client, client.config.lava.nodes, {user: client.user.id});
	client.lavacordManager.on('error', (err, node) => {console.error(`\nAn error occurred on Lava node ${node.id}.`, err)});

	await client.lavacordManager.connect()
		.then(() => {
			console.log(`${chalk.gray('\n[INFO]')} >> ${chalk.greenBright("Connected")} to Lavacord.`);
			client.misc.lava = true;
		})
		.catch(e => {console.log(`${chalk.red('\n[ERROR]')} >> ${chalk.yellow("Occured while connecting to Lavacord:")}`); console.error(e);});

	let botData = await BotDataSchema.findOne({finder: 'lel'})
		? await BotDataSchema.findOne({finder: 'lel'})
		: new BotDataSchema({
			finder: 'lel',
			commands: 0,
			servers: 0,
			servers_all: 0,
			restarts: 0,
			lastRestart: new Date(),
			errors_all: 0,
		});
    botData.restarts = botData.restarts + 1;
    botData.lastRestart = new Date();

	console.log(`${chalk.gray('\n[INFO]')} >> ${chalk.white(`This is restart #${botData.restarts}.`)}`);

	let cms = new Date().getTime();
	console.log(`${chalk.gray('\n[INFO]')} >> ${chalk.white(`Startup completed in ${cms - client.misc.startup.getTime()}ms (${cms - client.misc.startupNoConnect.getTime()}ms post-connect).`)}`);

    await botData.save();
};