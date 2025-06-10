const express=require('express');
const router=express.Router();
const { signup, login, validateToken, updateSocketID, getUserById, getUserScore } = require('../controllers/user.controller');
const { body } = require('express-validator');

router.post(
    '/signup',
    [body('name').isLength({ min: 3 }), body('email').isEmail(), body('password').isLength({ min: 5 })],
    signup
);
router.post(
    '/login',
    [body('email').isEmail(), body('password').isLength({ min: 5 })],
    login);

router.get('/validateToken',validateToken);
router.get('/updateSocketID',updateSocketID);
router.get('/:id',getUserById);
router.get('/score/:id',getUserScore);
module.exports=router