const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.createUsersTable = async (req, res) => { 
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS tb_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(30) NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )`)

        // console.log('Create user table success');
        res.json('Create Users table');
    } catch (error) {
        console.log(error);
    }
}

exports.showUserTable = async (req, res) => {
    try {
        const [users] = await new Promise((resolve, reject) => {
            pool.query(`
                    SELECT * FROM tb_users
                `, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
        });

        console.log(users);
        res.json({
            username: users.username
        });
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
}

exports.register = async (req, res) => {
    const {username, password} = req.body;

    try {
        // Check username duplicate or not ?
        const rows = await new Promise((resolve, reject) => {
            pool.query(`SELECT * from tb_users WHERE username = ?`, [username],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        });

        console.log(rows);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const registerResult = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO tb_users (username, password) VALUES (?, ?)`, [username, hashedPassword],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        });
         console.log(registerResult);

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const rows = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tb_users WHERE username = ?`, [username],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        });

        const user = rows[0];
        console.log(user);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid Password');
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

        res.status(200).json({ 
            message: 'login successully',
            token: token
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error 500' });
    }
}