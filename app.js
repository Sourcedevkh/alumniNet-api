const express = require('express');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Super-admin 
const authRoute = require('./routes/super-admin/userRoute');


app.use('/api/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
});