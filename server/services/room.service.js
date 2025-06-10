const roomModel = require('../models/room.model');

const createRoom = async (name, x_id) => {
    if (!name || !x_id) throw new Error("All fields are required");
    try {
        const createdRoom = await roomModel.create({ name, players: { x: x_id } });
        const room = await roomModel.findById(createdRoom._id).populate('players.x');
        return room;
    } catch (error) {
        throw new Error("Error creating room: " + error.message);
    }
}

const joinRoom = async (o_id,roomId) => {
    if (!o_id) throw new Error("All fields are required");
    try {
        let room;
        if(roomId){
            room = await roomModel.findById(roomId);
            if (!room) throw new Error(`Room: ${roomId} not found`);
        } 
        else room = await roomModel.findOne({ status: 'waiting' });
        if (!room) throw new Error("No room available");
        room.players.o = o_id;
        room.status = 'full';
        await room.save();
        await room.populate('players.x');
        await room.populate('players.o');
        return room;
    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') throw new Error("Invalid room id");
        throw new Error("Error joining room: " + error.message);
    }
}

const getAllRooms = async () => {
    try {
        const rooms = await roomModel.find({ status: 'full' }, { name: 1, _id: 1 });
        return rooms;
    } catch (error) {
        throw new Error("Error retrieving rooms: " + error.message);
    }
}

const checkWinner = (board) => {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][0] === board[i][2] && board[i][0] !== null) return board[i][0];
        if (board[0][i] === board[1][i] && board[0][i] === board[2][i] && board[0][i] !== null) return board[0][i];
    }
    if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== null) return board[0][0];
    if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] !== null) return board[0][2];
    return null;
}

const checkGameOver = (board) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) return false;
        }
    }
    return true;
}

const move = async (roomId, i, j, player) => {
    try {
        return await roomModel.findOneAndUpdate(
            { _id: roomId, [`board.${i}.${j}`]: null },
            {
                $set: {
                    [`board.${i}.${j}`]: player,
                    turn: player === 'x' ? '0' : 'x'
                }
            },
            { new: true }
        );
    } catch (error) {
        throw new Error("Error making move: " + error.message);
    }
}

const destroyRoom = async (roomId) => {
    try {
        return await roomModel.findByIdAndDelete(roomId);
    } catch (error) {
        throw new Error("Error deleting room: " + error.message);
    }
}

const restartGame = async (roomId, winner) => {
    try {
        // Build the update object
        const update = {
            $set: {
                board: [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ],
                turn: 'x'
            },
            $inc: {
                rounds: 1
            }
        };

        // Conditionally increment score if winner is 'x' or 'o'
        if (winner === 'X') {
            update.$inc['score.x'] = 1;
        } else if (winner === '0') {
            update.$inc['score.o'] = 1;
        }

        const room = await roomModel.findOneAndUpdate(
            { _id: roomId },
            update,
            { new: true }
        );
        await room.populate('players.x');
        await room.populate('players.o');
        return room;

    } catch (error) {
        throw new Error("Error restarting game: " + error.message);
    }
}
const getRoomCount = async (status) => {
    try {
        const count = await roomModel.countDocuments({ status });
        return count;
    } catch (error) {
        throw new Error("Error getting room count: " + error.message);
    }
}

const getRoom = async (roomId) => {
    try {
        const room = await roomModel.findById(roomId).populate('players.x').populate('players.o');
        if (!room) throw new Error(`Room: ${roomId} not found`);
        return room;
    } catch (error) {
        throw new Error("Error retrieving room: " + error.message);
    }
}


module.exports = {
    createRoom,
    joinRoom,
    getAllRooms,
    checkWinner,
    checkGameOver,
    move,
    destroyRoom,
    restartGame,
    getRoomCount,
    getRoom
}
