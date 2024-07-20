const pool = require('../config/db');
const moment = require('moment-timezone');

exports.createExpenseTable = async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`CREATE TABLE IF NOT EXISTS tb_expense (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user VARCHAR(30) NOT NULL,
                date DATE NOT NULL,
                detail TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                category VARCHAR(30) NOT NULL,
                price INT NOT NULL
                ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        });

        console.log('Create expense table successfully', result);
        res.status(200).json({ message: 'Create expense table successfully' });

    } catch (error) {
        console.log('Create expense table Failed', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.showExpense = async (req, res) => {
    try {
        console.log(`User: ${req.user.username}`);

        const result = await new Promise((resolve, reject) => {
            pool.query(`
                SELECT * FROM tb_expense WHERE user = ?
                `, [req.user.username], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        });

        console.log(result);
        res.status(200).json({ expenses: result });

    } catch (error) {
        console.log('Show expense Failed', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.recordExpense = async (req, res) => {
    const expenses = req.body.expenses;
    console.log('From server user from token:', req.user.username);

    if (!Array.isArray(expenses) || expenses.length === 0) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    const values = expenses.map(expense => {
        const adjustedDate = moment(expense.date).add(1, 'day').format('YYYY-MM-DD');
        return [
            req.user.username,
            adjustedDate,
            expense.detail,
            expense.category,
            expense.price
        ]
    })

    try { 
        const result = await new Promise((resolve, reject) => {
            pool.query(`
                INSERT INTO tb_expense (user, date, detail, category, price) VALUES ?
                `, [values], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        });

        console.log('Insert expense successfully', result);
        res.status(200).json({ message: 'Insert expense successfully' });

    } catch (error) {
        console.log('Insert expense Failed', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

