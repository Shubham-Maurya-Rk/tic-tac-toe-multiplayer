require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();
const userRouter = require('./routes/user.route')
const roomRouter = require('./routes/room.route')
const http = require('http')
const cors = require('cors')
const connect = require('./dbconfig');
const { checkWinner, checkGameOver, move, destroyRoom, restartGame } = require('./services/room.service');
const roomModel = require('./models/room.model');
const { findBestMove } = require('./utils/game');
const { updateScore } = require('./services/user.service');
connect();

const server = http.createServer(app);
const port = process.env.PORT;

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hare Krsna')
})

app.use('/user', userRouter)
app.use('/room', roomRouter)
app.post('/best-move', (req, res) => {
    const board = req.body.board; // 2D array (3x3)
    const player = req.body.player; // 'x' or '0'

    const move = findBestMove(board, player);
    res.json({ move }); // { i: 0, j: 2 }
});

const sendRoomDetails = (roomId, room) => {
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId.toString()).emit('room-details', {data: room, roomSize});
}

io.on('connection', (socket) => {
    console.log('User Connected:', socket.id)
    // New Game
    socket.on('joinRoom', async ( roomId ) => {
        socket.join(roomId.toString());
        const room = await roomModel.findById(roomId);
        await room.populate('players.x');
        await room.populate('players.o');
        sendRoomDetails(roomId, room);
    })

    // Move
    socket.on('move', async ({ roomId, i, j, player }) => {
        const room = await move(roomId, i, j, player);
        const winner = checkWinner(room.board);
        const gameOver = checkGameOver(room.board);
        if (winner) {
            await updateScore(room.players[winner==='x'?'x':'o']);
            io.to(roomId).emit('winner', winner);
        } else if (gameOver) io.to(roomId).emit('gameOver');
        await room.populate('players.x');
        await room.populate('players.o');
        if (room) sendRoomDetails(roomId, room);
    })

    // Leave Game
    socket.on('leaveGame', async ({ roomId, player }) => {
        const room = await destroyRoom(roomId);
        if (room) {
            socket.to(roomId).emit('destroy', player);
        }
    })
    socket.on('gameOver', async (roomId) => {
        const room = await destroyRoom(roomId);
    })
    socket.on('restartGame', async ({roomId, winner}) => {
        const room = await restartGame(roomId, winner);
        sendRoomDetails(roomId, room);
    })

    // Leave Room
    socket.on('leaveRoom', async (roomId) => {
        socket.leave(roomId);
        socket.leave(socket.id);
        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        io.to(roomId).emit('spectators', roomSize);
    })
    socket.on('send-msg', ({ name, msg, roomId }) => {
        socket.to(roomId).emit('msg', { name, msg });
    })
    socket.on('disconnect', () => {
        console.log('- User DisConnected:', socket.id)
    })
})

server.listen(port, () => {
    console.log('listening on port:', port)
})
