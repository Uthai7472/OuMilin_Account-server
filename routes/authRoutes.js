const express = require('express');
const { createUsersTable, showUserTable, register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/create_user_table', createUsersTable);
router.get('/users', showUserTable);
router.post('/register', register);
router.post('/login', login);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Tjis is a protected route', user: req.user });
})

module.exports = router;