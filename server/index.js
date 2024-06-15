import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://websockets-vert.vercel.app'],// Allowed origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    },
});
const port = process.env.PORT || 4000;

const allowedOrigins = ['http://localhost:5173', 'https://websockets-vert.vercel.app'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Origin', 'Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.options('*', cors());

app.get('/', (req, res) => {
    res.json({ msg: 'Hello' });
});

io.on('connection', (socket) => {                                  //0
    console.log('a user connected', socket.id);
    socket.emit('welcome', `Hello welcome to server ${socket.id}`) //1
    socket.broadcast.emit('notify', `${socket.id} User has joined`) //2
    socket.on('message', ({ message, room }) => {                                 //3
        console.log(message);

        if (room.length > 0) {
            console.log(message, "in room");
            socket.to(room).emit('foryou', message)  //io.to(room).emit('foryou', message)  can also work
        }
        else {
            io.emit('toallusers', message);                                 //4
            socket.broadcast.emit('broadcasted', message);                   //5
        }

    })

    socket.on('create-room', (room) => {                             //6
        console.log(room)
        socket.join(room)
    })
    socket.on('disconnect', () => {                                   //7
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
