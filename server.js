const express = require('express');
const authRouter = require('./router/authRouter');
const db = require('./config/db');

const app = express();

app.use(express.json());
app.use('/users', authRouter);

app.listen(4000,()=>{
    console.log('Server is running on port 4000');
});