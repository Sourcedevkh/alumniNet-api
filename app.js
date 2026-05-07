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
const scholarshipRoute = require('./routes/admin/scholarshipRoutes');
const profileRoute = require('./routes/admin/profileRoutes');

// Student
const studentRoute = require('./routes/admin/studentRoutes');


app.use('/api/auth', authRoute);
app.use('/api/admin/auth', authAdminRoute);
app.use('/api/admin/student', studentRoute);
app.use('/api/admin/profile', profileRoute);
app.use('/api/scholarship', scholarshipRoute);


app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
});