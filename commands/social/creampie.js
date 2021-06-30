const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "creampie",
    aliases: ['creampie'],
    help: "Show the world your creaming skils with {{p}}creampie!",
    meta: {
        category: 'Social',
        description: "Give the gift of a creampie!",
        syntax: '`creampie`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'creampie'}) ? await Saves.findOne({name: 'creampie'}) : new Saves({name: 'creampie'});
        let saves = savess.saves;
        if (!args.length) {return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} gave out a massive creampie!`)
            .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
            .setColor('00cd00')
        );}
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new creampie GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("I made a new creampie!...ew");
        }
    }
};