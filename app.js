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
const subjectRoute = require('./routes/admin/subjectRoute');
const profileRoute = require('./routes/admin/profileRoutes');
const generationRoute = require('./routes/admin/generationRoutes');
const studentRoute = require('./routes/admin/studentRoutes');
const classRoute = require('./routes/admin/classesRoute');
const scoreRoute = require('./routes/admin/scoreRoute');
const certificateRoute = require('./routes/admin/certificateRoute');
const gradeRoute = require('./routes/admin/gradeRoute');


app.use('/api/super-admin/auth', authRoute);
app.use('/api/admin/auth', authAdminRoute);
app.use('/api/admin/student', studentRoute);
app.use('/api/admin/profile', profileRoute);
app.use('/api/admin/score', scoreRoute);
app.use('/api/admin/scholarship', scholarshipRoute);
app.use('/api/scholarship', scholarshipRoute);
app.use('/api/admin', certificateRoute);
app.use('/api/admin/generations', generationRoute);
app.use('/api/admin/subjects', subjectRoute);
app.use('/api/admin/classes', classRoute);
app.use('/api/admin', gradeRoute);


app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
});
