const express = require('express');
const  router = express.Router();
const { body } = require('express-validator');
const {createRoom,joinRoom, getAllRooms, getRoomsCount, getRoom} = require('../controllers/room.controller');

router.post(
    '/create',
    [
        body('name').isLength({ min: 3 }),
        body('x_id').isMongoId(),
    ],
    createRoom );

router.post(
    '/join',
    [
        body('o_id').isMongoId(),
    ],  
    joinRoom );

router.get(
    '/all-rooms',
    getAllRooms );

router.get(
    '/available-rooms',
    getRoomsCount );

router.get(
    '/:id',
    getRoom );



module.exports = router;