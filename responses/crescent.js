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

        if (incl(["heya luno", "hi luno", "sup luno", "what's up luno", "whats up luno", "hey luno", "hai luno", "howdy luno"])) {
            const r = ["Heya there Crescent! How are ya?", "Hi cutie ^^ What's up?", "Sup qt ;) Hru?", "What's up my favorite femboy?"];
            await message.channel.send(r[Math.floor(Math.random() * r.length)]);
            try {
                let content = await message.channel.awaitMessages(m => m.author.id === "480535078150340609", {max: 1, errors: ['time'], time: 60000, maxMatches: 1});
                content = content.first().content;
                if (incl(["not so good", "not good", "not pog"], content.toLowerCase())) {
                    const r2 = ["Aw :( I sowwy", "y sadge moment?"];
                    await message.channel.send(r2[Math.floor(Math.random() * r2.length)]);
                    try {
                        content = await message.channel.awaitMessages(m => m.author.id === "480535078150340609", {max: 1, errors: ['time'], time: 60000, maxMatches: 1});
                        content = content.first().content;
                        
                    } catch {}
                }
                if (content.toLowerCase().includes("good")) {
                    const r2 = ["That's good to hear qt ^^", "Me too!", ":) Glad to know my favorite femboy is doing well!"];
                    return message.channel.send(r2[Math.floor(Math.random() * r2.length)]);
                }
            } catch {}
        }
    }
}