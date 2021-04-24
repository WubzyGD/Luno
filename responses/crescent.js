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

        if (incl(['gn luno', 'goodnight luno', 'night luno'])) {
            const r = ["Goodnight! :)", "Night Cres, I hope the server hasn't beckoned your wake for too long.", "I hope you're off to get some good sleep ^^ or perhaps ang is sleepy too? :eyes:"];
            message.channel.send(`${r[Math.floor(Math.random() * r.length)]} Want me to set your status before you go off?`);
            let to = false; let sconf;
            try {sconf = await message.channel.awaitMessages(m => m.author.id === "480535078150340609", {time: 15000, errors: ['time'], max: 1});}
            catch {message.channel.send("Oh, I guess she already went to bed, huh? I'll just... set his status anyways-"); to = true;}
            if (sconf) {sconf = sconf.first().content.trim().toLowerCase();}
            if (to || incl(['ye', 'mhm', 'sure'], sconf)) {
                let w = await UserData.findOne({uid: message.author.id});
                w.statusclearmode = 'manual';
                w.statusmsg = "Sleeping";
                w.statussetat = new Date();
                let tempDate = new Date();
                w.statusclearat = tempDate.setHours(tempDate.getHours() + 12);
                w.statustype = 'dnd';
                w.save();
                if (!to) {message.channel.send("Okay! I set your status for you. Get some good sleep; I'll make sure the server's safe for you.");}
                return;
            } else {return message.channel.send("Alrighty. Have a good night, my favorite femboy");}
        }

        if (incl(['love you', 'wub you', 'love u', 'wub u', 'luv u', 'wub u']) && inc('luno')) {
            const r = ["uwu //// b-but i'm busy trying to mod right now crescent!", "but what happened to ang?",
            "i will neither confirm nor deny my feelings for you", ":eyes: :wink:"];
            return message.channel.send(r[Math.floor(Math.random() * r.length)]);
        }
    }
}