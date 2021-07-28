const LXP = require('../../models/localxp');
const Monners = require('../../models/monners');
const chalk = require('chalk');

module.exports = async (client) => {
    let cd = new Date().getTime();
    //console.log(chalk.blueBright("\nSYNC/STRT || Beginning new Database sync loop"));
    await Object.keys(client.misc.cache.lxp.xp).forEach(gxp => {
        LXP.findOne({gid: gxp}).then(xp => {
            if (!xp) {return;}
            Object.keys(client.misc.cache.lxp.xp[gxp]).forEach(user => {
                Monners.findOne({uid: user}).then(m => {
                    if (!Object.keys(client.misc.cache.monners).includes(user)) {/*console.log(chalk.yellow(`\nSYNC/VAL || User ${client.guilds.cache.get(client.misc.neptune).members.cache.get(user).displayName} in XP cache but not Monners cache. Aborting.`));*/ return;}
                    //console.log(`\nSYNC/PRE  || Syncing monners for ${client.guilds.cache.get(client.misc.neptune).members.cache.get(user).displayName}. Doc ${m ? `exists and ${m.currency ? chalk.greenBright('has') : chalk.redBright("doesn't have")} currency field` : chalk.magenta("doesn't exist")}.`);
                    if (!m) {
                        //console.log(`SYNC/PRE || Didn't find doc. Making new.`);
                        m = new Monners({uid: user});
                    }
                    //console.log(`SYNC/PRE  || User ${m.currency ? chalk.greenBright('has') : chalk.redBright("doesn't have")} currency field.`);
                    //let pre = m.currency ? true : false;
                    m.currency = client.misc.cache.monners[user];
                    m.save();
                    //let post = m.currency ? true : false;
                    //console.log(`SYNC/POST || User ${m.currency ? chalk.greenBright('has') : chalk.redBright("doesn't have")} currency field.`);
                    //if (pre && !post) {console.log(chalk.red(`SYNC/POST || Had currency field but it vanished.`));}
                });
                xp.xp[user] = [client.misc.cache.lxp.xp[gxp][user].xp, client.misc.cache.lxp.xp[gxp][user].level];
                xp.markModified(`xp.${user}`);
                if (cd - client.misc.cache.lxp.xp[gxp][user].lastXP > 600000) {
                    delete client.misc.cache.lxp.xp[gxp][user];
                    delete client.misc.cache.monners[user];
                    if (!Object.keys(client.misc.cache.lxp.xp[gxp]).length) {delete client.misc.cache.lxp.xp[gxp];}
                }
            });
            xp.save();
        });
    });
};