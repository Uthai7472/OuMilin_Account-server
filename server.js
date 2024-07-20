const express = require('express');
const dotenv = require('dotenv');
const authRoute = require('./routes/authRoutes');
const expenseRoute = require('./routes/expenseRoute');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoute);
app.use('/api/expense', expenseRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
})