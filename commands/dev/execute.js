const Discord = require('discord.js');

const cp = require("child_process");

module.exports = {
    name: "Execute",
    aliases: ['exec'],
    meta: {
        category: 'Developer',
        description: "Execute a console command",
        syntax: '`Execute <command>`',
        extra: null
    },
    help: "Dev only! Executes a console command",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.developers.includes(message.author.id)) {return message.channel.send("You must be a developer to do this!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}execute <command>\``);}
        return cp.exec(args.join(" "), function(error, stdout, stderr) {
            if (error) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription(`\`\`\`${error}\`\`\``)
                    .setColor("ff446a")
                    .setFooter("Luno", client.user.avatarURL())
                    .setTimestamp()
                );
            }

            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Execution Successful")
                .setDescription(`\`\`\`${stdout}\`\`\``)
                .setColor("328ba8")
                .setFooter("Luno", client.user.avatarURL())
                .setTimestamp()
            );
        });
    }
};