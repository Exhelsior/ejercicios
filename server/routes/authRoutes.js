const express = require('express');
const { login, createUser, sendToken, validateToken, changePassword } = require('../controller/crud_API');

const router = express.Router();

router.post('/api/login', login);
router.post('/api/register', createUser);
router.post('/api/sendToken', sendToken);
router.post('/api/validateToken', validateToken);
router.post('/api/changePassword', changePassword);

module.exports = router;