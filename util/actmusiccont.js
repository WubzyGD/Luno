const Discord = require("discord.js");
const moment = require('moment');
require('moment-precise-range-plugin');

const updateController = require("./updatecontroller");

module.exports = async function activateControls(message, client) {
    let col = await message.createReactionCollector((r) => ['⏯️', '⏭️', '⏹️', '🔁', '🔉', '🔊'].includes(r.emoji.name), {time: 1000 * 60 * 30});
    col.on('collect', async (r, u) => {
        if (!r.message.guild.members.cache.get(u.id).voice.channel || !r.message.guild.members.cache.get(u.id).voice.channel === client.misc.queue[message.guild.id].channel) {return;}
        let functions = {
            '⏯️': async () => {
                await client.misc.queue[message.guild.id].player.pause(!client.misc.queue[message.guild.id].player.paused);
                updateController(message, client);
            },
            '⏭️': async () => {
                client.misc.queue[message.guild.id].queue.shift();

                if (!client.misc.queue[message.guild.id].queue.length) {
                    await client.lavacordManager.leave(message.guild.id);
                    message.guild.channels.cache.get(client.misc.queue[message.guild.id].updates).send('Finished playing.');
                    col.stop();
                    return delete client.misc.queue[message.guild.id];
                }

                await client.misc.queue[message.guild.id].player.play(client.misc.queue[message.guild.id].queue[0].song.track);
                updateController(message, client);
            },
            '⏹️': async () => {
                await client.lavacordManager.leave(message.guild.id);
                message.guild.channels.cache.get(client.misc.queue[message.guild.id].updates).send('Finished playing.');
                col.stop();
                return delete client.misc.queue[message.guild.id];
            },
            '🔁': () => {},
            '🔉': async () => {
                if (client.misc.queue[message.guild.id].volume <= 10) {return;}
                client.misc.queue[message.guild.id].volume -= 10;
                await client.misc.queue[message.guild.id].player.volume(client.misc.queue[message.guild.id].volume);
                updateController(message, client);
            },
            '🔊': async () => {
                if (client.misc.queue[message.guild.id].volume >= 150) {return;}
                client.misc.queue[message.guild.id].volume += 10;
                await client.misc.queue[message.guild.id].player.volume(client.misc.queue[message.guild.id].volume);
                updateController(message, client);
            }
        };
        return functions[r.emoji.name]();});
    col.on('end', () => {
        if (!client.misc.queue[message.guild.id]) {return;}
        client.misc.queue[message.guild.id].controller.delete().catch(() => {});
        if (client.misc.queue[message.guild.id].queue.length) {updateController(message, client);}
    });
};