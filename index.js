const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const quickhook = require("quick.hook");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();
let xp = require("./xp.json");
let purple = botconfig.purple;

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could'nt find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
})


bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("DirtyNetwork", { type: "PLAYING" });
});

bot.on("guildMemberAdd", function(member) {
    let role = member.guild.roles.find("name", "✓ | Speler");
    member.addRole(role).catch(console.error);
});

bot.on('guildMemberAdd', member => {
    const welcomechannel = member.guild.channels.find('name', 'welkom')

    var newuserjoinembed = new Discord.RichEmbed()
      .setColor(0xffffff)
      .setDescription(`Welkom ${member}, op DirtyNetwork!\n**Hulp nodig :** !help\n**Meer hulp nodig :** !ticket <reden voor help>`)
      .addBlankField()
      .setFooter(`Speler joined`)
      .setTimestamp()
      return welcomechannel.send(newuserjoinembed);
});

bot.on('guildMemberRemove', member => {
    const goodbyechannel = member.guild.channels.find('name', 'welkom')

    var newuserjoinembed = new Discord.RichEmbed()
      .setColor(0xffffff)
      .setDescription(`Totziens ${member}, we zullen je missen!`)
      .setFooter(`Speler left`)
      .setTimestamp()
      return goodbyechannel.send(newuserjoinembed);
});

bot.on('message', message => {
    const swearWords = ["kanker", "kkr","tering", "ebola", "aids", "KANKER", "Kanker", "cancer", "Cancer", "CANCER"];
    if( swearWords.some(word => message.content.includes(word)) ) {
        message.delete();
        message.author.send('Sorry hoor. Maar met dit woord mag je niet schelden!');
      }
})


bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);

    let xpAdd = Math.floor(Math.random() * 7) + 8;
    console.log(xpAdd);
  
    if(!xp[message.author.id]){
      xp[message.author.id] = {
        xp: 0,
        level: 1
      };
    }
  
  
    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 300;
    xp[message.author.id].xp =  curxp + xpAdd;
    if(nxtLvl <= xp[message.author.id].xp){
      xp[message.author.id].level = curlvl + 1;
      let lvlup = new Discord.RichEmbed()
      .setTitle("Level Up!")
      .setColor(purple)
      .addField("Nieuw Level", curlvl + 1);
  
      message.channel.send(lvlup).then(msg => {msg.delete(5000)});
    }
    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
      if(err) console.log(err)
  });

    // if (cmd === `${prefix}ban`) {



    //     let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    //     if (!bUser) return message.channel.send("Can't find user!");
    //     let bReason = args.join(" ").slice(22);
    //     if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Sorry! You don't have permissions");
    //     if (bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You can't kick this person!");

    //     let banEmbed = new Discord.RichEmbed()
    //         .setDescription("©️TeamPlayPlace - Ban")
    //         .addBlankField()
    //         .setColor("#ff0000")
    //         .addField("Banned User", `${bUser}`)
    //         .addField("Banned By", `<@${message.author.id}>`)
    //         .addField("Reason", bReason);


    //     let incidentchannel = message.guild.channels.find(`name`, "punishment");
    //     if (!incidentchannel) return message.channel.send("Can't find this channel");


    //     message.guild.member(bUser).ban(bReason);
    //     incidentchannel.send(banEmbed);

    //     return;
    // }

    // if (cmd === `${prefix}kick`) {



    //     let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    //     if (!kUser) return message.channel.send("Can't find user!");
    //     let kReason = args.join(" ").slice(22);
    //     if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry! You don't have permissions");
    //     if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You can't kick this person!");

    //     let kickEmbed = new Discord.RichEmbed()
    //         .setDescription("©️TeamPlayPlace - Kick")
    //         .addBlankField()
    //         .setColor("#ff0000")
    //         .addField("Kicked User", `${kUser}`)
    //         .addField("Kicked By", `<@${message.author.id}>`)
    //         .addField("Reason", kReason);


    //     let kickChannel = message.guild.channels.find(`name`, "punishment");
    //     if (!kickChannel) return message.channel.send("Can't find this channel");


    //     message.guild.member(kUser).kick(kReason);
    //     kickChannel.send(kickEmbed);

    //     return;
    // }

    // if (cmd === `${prefix}report`) {

    //     let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    //     if (!rUser) return message.channel.send("Couldn't find user.");
    //     let reason = args.join(" ").slice(22);

    //     let reportEmbed = new Discord.RichEmbed()
    //         .setDescription("©️TeamPlayPlace - Report")
    //         .addBlankField()
    //         .setColor("#ff0000")
    //         .addField("Reported User", `${rUser}`)
    //         .addField("Reported by", `${message.author}`)
    //         .addField("Reason", reason)
    //         .addField("Channel", message.channel);


    //     let reportschannel = message.guild.channels.find(`name`, "reports");
    //     if (!reportschannel) return message.channel.send("Couldn't find reports channel.")


    //     message.delete().catch(O_o => { });
    //     reportschannel.send(reportEmbed);

    //     return;
    // }

    // if (cmd === `${prefix}serverinfo`) {
    //     let sicon = message.guild.iconURL;
    //     let serverembed = new Discord.RichEmbed()
    //         .setDescription("©️TeamPlayPlace - Server Information")
    //         .addBlankField()
    //         .setColor("#15f153")
    //         .setThumbnail(sicon)
    //         .addField("Server Name", message.guild.name)
    //         .addField("Server CEO", "DarkWinq & Strongfo")
    //         .addField("Server Started On", "01-11-2018")
    //         .addField("Server Version", "3.0")
    //         .addField("Server IP", "playplace.net")
    //         .addField("Total Members", message.guild.memberCount);

    //     return message.channel.send(serverembed);
    // }

});

bot.login(botconfig.token);