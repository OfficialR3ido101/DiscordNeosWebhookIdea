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
    var thing = 0;
    client.on('interactionCreate', async interact => {
        if (!interact.isCommand) return;

        switch (interact.commandName) {
            case "forward":
                thing + 1;
                server.emit("thing", {
                    thing: interact.options.getString("funits")
                })
                console.log("+1")
                interact.reply("+1")
                break;

            case "backwards":
                thing = 0;
                server.emit("thing", {
                    thing: "-" + interact.options.getString("bunits")
                })
                console.log("-1");
                interact.reply("-1")
                break;

            case "invis":
                server.emit("thing", {
                    thing: interact.options.getBoolean('status').toString()
                })
                console.log("magic!")
                interact.reply("magic!")
                break;
        }
    })

}