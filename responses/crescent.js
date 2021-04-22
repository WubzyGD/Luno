const Discord = require('discord.js');

const UserData = require('../models/user');

const ask = require('../util/ask');

module.exports = {
    name: "crescent",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> ")
        .setDescription("")
        .addField("Syntax", "``"),
    async condition (message, msg, args, cmd, prefix, mention, client) {return message.author.id === "480535078150340609"},
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const inc = (m,s) => s ? s.toLowerCase().includes(m) : msg.includes(m);
        const is = m => msg.trim() === m;
        function incl(ml, s) {let tm; for (tm of ml) {if (inc(tm, s)) {return true;}}}

        if (incl(["thanks luno", "thank you luno", "ty luno"])) {
            const r = ["Anything for my favorite femboy ;)", "Anytime Crescent ;)", "Gee I sure hope I'm not stealing your love for ang... or do I?"];
            return message.channel.send(r[Math.floor(Math.random() * r.length)]);
        }

        if (incl(["heya luno", "hi luno", "sup luno", "what's up luno", "whats up luno"])) {
            const r = ["Heya there Crescent!", "Hi cutie ^^", "Sup qt ;)", "What's up my favorite femboy?"];
            return message.channel.send(r[Math.floor(Math.random() * r.length)]);
        }
    }
}