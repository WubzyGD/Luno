module.exports = async (client, reaction, user) => {
    if (reaction.partial) {try {await reaction.fetch();} catch {return;}}
    if (user.bot) {return;}

    if (reaction.message.guild && client.misc.queue[reaction.message.guild.id]
    && reaction.message.guild.members.cache.get(user.id).voice.channel
    && reaction.message.guild.members.cache.get(user.id).voice.channel.id === client.misc.queue[reaction.message.guild.id].channel
    && reaction.message.id === client.misc.queue[reaction.message.guild.id].controller.id
    && reaction.emoji.name === '⏯️') {
        await client.misc.queue[reaction.message.guild.id].player.pause(false);
        require('../util/updatecontroller')(reaction.message, client);
    }
};