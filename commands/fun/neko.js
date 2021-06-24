const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "neko",
    help: "Get a random neko image",
    meta: {
        category: 'Social',
        description: "Get a random neko image",
        syntax: '`neko`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'neko'}) ? await Saves.findOne({name: 'neko'}) : new Saves({name: 'neko'});
        let saves = savess.saves;
        if (!args.length) {return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Here's a random neko for you :3`)
            .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
            .setColor('aa459d')
        );}
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new neko GIFs/images.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("Save added!");
        }
    }
};