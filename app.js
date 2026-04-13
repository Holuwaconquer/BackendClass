const express = require('express');
const mongoose = require('mongoose');
const app = express()
const dotenv = require('dotenv')
const PORT = 4000
const userRoute = require('./src/routes/user.route')
const cors = require('cors')

app.use(cors({ origin: "http://localhost:5173", credentials: true}))
dotenv.config();


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/user', userRoute)
// app.use('/staff', require('./src/routes/staff.route'))

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Welcome to the server"
    })
})

app.get('/health', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Server is healthy"
    })
})
const URI = process.env.URI;

mongoose.connect(URI)
.then(() => {
    console.log("Connected to the database")
    app.listen(PORT, () => { 
        console.log("Our server is running on PORT from app.js: ", PORT)
        console.log(URI)
    })
}).catch((err) => {
    console.log("Error connecting to the database: ", err)
})