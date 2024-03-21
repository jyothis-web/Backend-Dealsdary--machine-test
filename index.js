const express = require("express");
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Config/dbconnection');
const authRoutes = require('./routes/authRoutes')
const employerDashboardRoutes = require('./routes/employerDashboardRoutes')


const app = express();
//middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//routes
app.use("/Employerauth",authRoutes);
app.use("/employerDashboard",employerDashboardRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server started on port :${PORT}`);
});
connectDB()