const express = require('express');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Super-admin 
const authRoute = require('./routes/super-admin/userRoute');

// Admin
const authAdminRoute = require('./routes/admin/userRoutes');


app.use('/api/auth', authRoute);
app.use('/api/admin/auth', authAdminRoute);

app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
});