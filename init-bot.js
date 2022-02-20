// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const cfg = require('./conf.json')
const WebSocket = require('ws');

module.exports.init = function () {
    // Create a new client instance
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    const server = new WebSocket.Server({
        port: cfg.ws.port
    });

    // When the client is ready, run this code (only once)
    client.once('ready', () => {
        console.log('Ready!');
    });

    // Login to Discord with your client's token
    client.login(cfg.discord.token);

    let sockets = [];
    server.on('connection', function (socket) {
        sockets.push(socket);
        console.log("Someone has joined.....")
        server.on("thing", function (data) {
            sockets.forEach(s => s.send(data.thing));
        })

        // When a socket closes, or disconnects, remove it from the array.
        socket.on('close', function () {
            sockets = sockets.filter(s => s !== socket);
        });
    });
    
    client.on('interactionCreate', async interact => {
        if (!interact.isCommand) return;

        switch (interact.commandName) {
            case "forward":
                var farg = interact.options.getString("funits");
                thing + 1;
                server.emit("thing", {
                    thing: farg
                })
                interact.reply(farg)
                break;

            case "backwards":
                var barg = interact.options.getString("bunits");
                server.emit("thing", {
                    thing: "-" + barg
                })
                interact.reply(barg)
                break;

            case "invis":
                let status = interact.options.getBoolean('status').toString();
                server.emit("thing", {
                    thing: status
                })
                interact.reply("magic!" + ` ${status}`)
                break;
        }
    })
}