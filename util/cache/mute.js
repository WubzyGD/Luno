const Mute = require('../../models/mute');

module.exports = async (client) => {
    client.misc.cache.mute = new Map();

    for await (const mute of Mute.find()) {
        client.misc.cache.mute.set(mute.uid, mute.until);
    }
};