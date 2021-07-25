const LXP = require('../../models/localxp');
const LR = require('../../models/levelroles');

module.exports = async (client, member, channel) => {
    client.misc.cache.lxp.xp[channel.guild.id][member].lastXP = new Date().getTime();
    client.misc.cache.lxp.xp[channel.guild.id][member].xp += 10;
    client.misc.cache.monners[member] += (Math.floor(client.misc.cache.lxp.xp[channel.guild.id][member].level / 35) + 1);

    let x = client.misc.cache.lxp.xp[channel.guild.id][member].level;
    let max = Math.ceil(100 + (((x / 2.85) ** 2.2) * 2.5));

    if (client.misc.cache.lxp.xp[channel.guild.id][member].xp > max) {
        client.misc.cache.lxp.xp[channel.guild.id][member].xp -= max;
        client.misc.cache.lxp.xp[channel.guild.id][member].level += 1;

        LXP.findOne({gid: channel.guild.id}).then(async xp => {
            if (!xp || !xp.msg) {return;}
            try {
                let ch = xp.lvch.length ? channel.guild.channels.cache.get(xp.lvch) : channel;
                if (ch.partial) {await ch.fetch().catch(() => {});}
                let cur = ((Math.floor((x + 1) / 10) + 1) * 5);
                client.misc.cache.monners[member] += cur;
                if (ch && ch.permissionsFor(ch.guild.me.id).has('SEND_MESSAGES')) {ch.send(`<a:CF_moonheart:868653516913246208> <@${member}> has reached **Level ${x + 1}**, and gained **${cur}** bonus Mooners<a:CF_mooners:868652679717589012>!`).catch((e) => {/*console.error(e)*/});}
                if (client.misc.cache.lxp.hasLevelRoles.includes(channel.guild.id)) {
                    LR.findOne({gid: channel.guild.id}).then(async lr => {
                        if (!lr) {return;}
                        if (Object.keys(lr.roles).includes(`${client.misc.cache.lxp.xp[channel.guild.id][member].level}`)) {
                            try {
                                let role = channel.guild.roles.cache.get(`${lr.roles[client.misc.cache.lxp.xp[channel.guild.id][member].level]}`);
                                if (!role) {return;}
                                if (!channel.guild.me.permissions.has("MANAGE_ROLES")) {return;}
                                let m = channel.guild.members.cache.get(member);
                                if (!m) {return;}
                                m.roles.add(role).catch((e) => {/*console.error(e);*/});
                            } catch (e) {/*console.error(e);*/}
                        }
                    });
                }
            } catch (e) {/*console.error(e);*/}
        }).catch((e) => {/*console.error(e);*/})
    }
};