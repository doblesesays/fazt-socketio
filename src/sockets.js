const Chat = require('./models/Chat');
module.exports = function(io) {

    let users = {};

    io.on('connection', async (socket) => {
        console.log('New user connected')

        let messages = await Chat.find({created_at: -1}).limit(8);
        socket.emit('load ols mgs', messages);

        socket.on('send message', async (data, cb) => {
            // "adsdadadad"
            // "/w doblesesays adsdadadad"
            var msg = data.trim();
            if (msg.substr(0,3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index != -1) {
                    var name = msg.substr(0, index);
                    var msg = msg.substr(index+1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname 
                        })
                        users[socket.nickname].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        })
                    } else {
                        cb('Error! Ingrese un usario valido');
                    }
                } else {
                    cb('Error! Ingrese un mensaje.');
                }
            } else {
                var newMsg = new Chat({nick: socket.nickname, msg});
                await newMsg.save();

                io.sockets.emit('new message', {
                    msg,
                    nick: socket.nickname
                });
            }
        })

        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false);
            } else {
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
                cb(true);
            }
        })

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        })

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}
