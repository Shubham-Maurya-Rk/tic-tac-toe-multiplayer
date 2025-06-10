const { validationResult } = require("express-validator");
const roomService = require('../services/room.service');

const createRoom = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const firstError = error.array()[0];
        return res.status(400).json({ error: `${firstError.path}: ${firstError.msg}` });
    }
    const { name, x_id } = req.body;
    try {
        const room = await roomService.createRoom(name, x_id);
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const joinRoom = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const { o_id, roomId } = req.body;
    try {
        const room = await roomService.joinRoom(o_id,roomId);
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getRoomsCount = async (req, res) => {
    try {
        const full = await roomService.getRoomCount('full');
        const waiting = await roomService.getRoomCount('waiting');
        res.status(200).json({ full, waiting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await roomService.getRoom(id);
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createRoom, joinRoom, getAllRooms, getRoomsCount, getRoom }
