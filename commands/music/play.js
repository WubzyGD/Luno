const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment');
require('moment-precise-range-plugin');
const sw = require('swwrap');

const activateControls = require('../../util/actmusiccont');
const updateController = require('../../util/updatecontroller');

module.exports = {
    name: "play",
    aliases: ['p'],
    meta: {
        category: 'Music',
        description: "Play a song!",
        syntax: '`play <songName|songURL>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Music Playing")
    .setDescription("Plays a song by searching for it or using a URL you provide.")
    .addField("Notice", "You must be in a voice channel in order to use this command!")
    .addField("Syntax", "`play <songName|songURL>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}play <songName|songURL>\``);}
        if (!message.member.voice.channel) {return message.channel.send("You have to be in a voice channel to play music, silly!");}
        if (client.misc.queue[message.guild.id] && (client.misc.queue[message.guild.id].channel !== message.member.voice.channel.id)) {return message.channel.send("You're in a voice channel, but it's not the music voice channel. Since there's already music playing from me in this server, I can't join your channel.");}

        if (client.misc.attemptedQueue.includes(message.guild.id)) {return message.channel.send("A wee too fast there!");}
        client.misc.attemptedQueue.push(message.guild.id);

        const swc = new sw.Client();
        
        const node = client.lavacordManager.idealNodes[0];
        const params = new URLSearchParams();
        let search = args.join(' ');
        let gotSpotify = false;
        const checkSpotify = () => {return new Promise(resolve => {
            if (search.match(/^https:\/\/open\.spotify\.com\/track\/\w+/gm)) {
                swc.getTrack(search.replace(/^https:\/\/open\.spotify\.com\/track\//gm, '').replace(/\?si=.+/gm, ''))
                    .then(r => {gotSpotify = true; search = `${r.artist} - ${r.name}`; return resolve(undefined);})
                    .catch(() => {return resolve(undefined);});
            } else {resolve(undefined);}
        });}
        await checkSpotify();

        params.append('identifier', search.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g) ? search : `ytsearch:${search}`);
    
        const data = await axios(`http://${node.host}:${node.port}/loadtracks?${params}`, {
            headers: {
                Authorization: node.password
            }
        });
    
        let [song] = data.data.tracks;
        client.misc.attemptedQueue.splice(client.misc.attemptedQueue.indexOf(message.guild.id), 1);
        if (!song) {return message.channel.send("I couldn't find that song! Try again?");}

        if (!client.misc.queue[message.guild.id]) {
            let player = await client.lavacordManager.join({
                guild: message.guild.id,
                channel: message.member.voice.channel.id,
                node: client.lavacordManager.idealNodes[0].id
            }, {selfdeaf: true});

            client.misc.queue[message.guild.id] = {
                player: player,
                queue: [{song: song, player: message.author.id}],
                votes: [],
                updates: message.channel.id,
                channel: message.member.voice.channel.id,
                volume: 50
            };

            player.on('end', async data => {
                if (data.reason === "REPLACED" || data.reason === "STOPPED") return;

                client.misc.queue[message.guild.id].queue.shift();

                if (!client.misc.queue[message.guild.id].queue.length) {
                    await client.lavacordManager.leave(message.guild.id);
                    message.guild.channels.cache.get(client.misc.queue[message.guild.id].updates).send('Finished playing.');
                    return delete client.misc.queue[message.guild.id];
                }

                await player.play(client.misc.queue[message.guild.id].queue[0].song.track);
                updateController(message, client);
            });

            await player.play(song.track);
            await player.volume(50);
            let tc = await message.channel.send(new Discord.MessageEmbed()
                .setAuthor("Now Playing", message.author.avatarURL())
                .setTitle(song.info.title)
                .setThumbnail(`https://i.ytimg.com/vi/${song.info.identifier}/maxresdefault.jpg`)
                .setDescription(`Channel: ${song.info.author}\n[Original video](${song.info.uri})`)
                .addField("Queued By", `<@${message.author.id}>`, true)
                .addField("Length", moment.preciseDiff(Date.now(), Date.now() + song.info.length), true)
                .addField("Songs in Queue", `**1** Song\n${moment.preciseDiff(Date.now(), Date.now() + song.info.length)}`)
                .addField("Settings", `Volume: **${client.misc.queue[message.guild.id].volume}**/**150**`)
                .setColor('328ba8')
                .setFooter("Luno")
            );
            let reactions = ['⏯️', '⏭️', '⏹️', '🔁', '🔉', '🔊'];
            for (let i = 0; i < reactions.length; i++) {await tc.react(reactions[i]);}
            client.misc.queue[message.guild.id].controller = tc;
            activateControls(client.misc.queue[message.guild.id].controller, client);
        } else {
            if (client.misc.queue[message.guild.id].queue.length >= 100) {return message.channel.send("Your queue is too big! Add the song after this one has played.");}
            client.misc.queue[message.guild.id].queue.push({song: song, player: message.author.id});
            message.channel.send(`Queued **${song.info.title}** | **${client.misc.queue[message.guild.id].queue.length - 1} song${client.misc.queue[message.guild.id].queue.length - 1 > 1 ? 's' : ''}** remaining until it's played.`);
            updateController(message, client);
        }
    }
};