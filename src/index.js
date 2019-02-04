require('dotenv').config()
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// static files
app.use(express.static(
    path.join(__dirname, 'public')
));

const server = http.createServer(app);
const io = socketio.listen(server);
require('./sockets')(io);

// mongodb connection
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fazt-socketio', { useNewUrlParser: true })
    .then(db => console.log(`DB connected`))
    .catch( err => console.log(`Error: ${err}`))

// settings
app.set('port', process.env.PORT || 3000)

// starting the server
server.listen(app.get('port'), () => console.log(`Server on port ${app.get('port')}`));