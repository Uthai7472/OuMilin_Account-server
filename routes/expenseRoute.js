const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { createExpenseTable, recordExpense, showExpense } = require('../controllers/expenseController');
 
const router = express.Router();

router.get('/create_tb_expense', authenticateToken, createExpenseTable);
router.get('/show', authenticateToken, showExpense);
router.post('/record', authenticateToken, recordExpense);

module.exports = router;