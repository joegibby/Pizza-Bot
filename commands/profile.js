const { Command } = require("discord-akairo");
const moment = require("moment")

const commandInfo = {
    id: "profile",
    aliases: [],
    args: [{id: "member", type: "member"}],
    description: {
        short: "View the profile of a user for the server.",
        extend: "if no user is given, it will display your own."
    }
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class ProfileCommand extends Command {
    constructor() {
        super(
            commandInfo.id,
            commandInfo
        );
    }

    async exec(message, args) {
        let member;
        if(args.member) {
            member = args.member
        } else {
            member = message.member;
        }
        const joinDate = new moment(member.joinedAt)
        const createdDate = new moment(member.user.createdAt)

        const memberList = await message.guild.members.fetch();
        const joinRank = memberList.filter(b => !b.user.bot)
            .sort((a, b) => b.joinedTimestamp - a.joinedTimestamp)
            .keyArray().reverse().
            indexOf(member.user.id) + 1;

        let roles = []
        for(let role of member.roles.cache) {
            if (role[1].name != "@everyone") {roles.push(role[1])}
        }

        await message.channel.send({ embed: {
            color: 16426522,
            thumbnail: {
                url: member.user.avatarURL()
            },
            footer: {
                text: `ID: ${member.user.id}`
            },
            fields: [
                {
                    name: "User",
                    value: member.user,
                    inline: true
                }, {
                    name: "Tag",
                    value: member.user.tag,
                    inline: true
                }, {
                    name: "Nickname",
                    value: member.nickname,
                    inline: true
                }, {
                    name: "Date Registered",
                    value: createdDate.format("DD MMM YYYY"),
                    inline: true
                }, {
                    name: "Date Joined",
                    value: joinDate.format("DD MMM YYYY"),
                    inline: true
                }, {
                    name: "Join Rank",
                    value: joinRank,
                    inline: true
                }, {
                    name: "Roles",
                    value: roles.join("\n"),
                    inline: true
                // }, {
                //     name: "Joined",
                //     value: `${since(member.joinedAt, 3)} ago.`,
                //     inline: true
                }
            ]
        }});
    }
}

module.exports = ProfileCommand