// const express = require('express');
// const mongoose = require('mongoose');
// const app = express()

// const PORT = 6000
// const userRoute = require('./routes/user.route')

// // middleware
// app.use(express.json())
// app.use(express.urlencoded({ extended: true}))

// app.use('/user', userRoute)
// // app.use('/staff', require('./routes/staff.route'))

// const URI = "mongodb+srv://sabiload:hPlOVzcDeST8HswP@sabiload-admin.wnihnqb.mongodb.net/backendproject?retryWrites=true&w=majority&appName=Sabiload-admin";

// mongoose.connect(URI)
// .then(() => {
//     console.log("Connected to the database")
//     app.listen(PORT, () => { 
//     console.log("Our server is running on PORT: ", PORT)
// })
// }).catch((err) => {
//     console.log("Error connecting to the database: ", err)
// })


// // cors - cross origin resource sharing




// //client - post - (middleware) - save to database (logic in the controller)


// // get, post, put, patch, delete


// // app.get('/users', (req, res) => {

// // })

// // app.post('/', (req, res) => {
// //     console.log('This is the request from the client: ', req.body)

// //     const { email, password } = req.body

// //     if(!email || !password || email === '' || password === ''){

// //         res.status(404).json({
// //             status: false,
// //             message: 'Email and password are required'
// //         })
// //     }

// //     res.status(200).json({
// //         status: true,
// //         message: 'Your response has been received',
// //         data: { email, password }
// //     })

// //     res.send('Endpoint meet')
// // })


// // localhost:5000/allstudents

// // app.get('/', (req, res) => {
// //     // res.send('Welcome to our api')
// //     // res.resend()
// //     res.sendFile(__dirname + '/index.html')
    
// // })

// // app.get('/allStudents', (req, res) =>{
// //     res.send("All students sent from the server")
// // })
// //uri - uniform resource identifier
// //url - uniform resource locator

// // status code 
// // 200 - success
// // 201 - created
// // 400 - bad request
// // 404 - not found
// // 500 - internal server error
// // 501 - not implemented
// // 502 - bad gateway
// // 503 - service unavailable
// // 422 - unprocessable entity

// // MVC architecture
// // Model - data types, structure, and database

// // View - screens, pages, and user interface

// // Controller - logic, functions, and how the data is manipulated and sent to the view

// // Route 

// // localhost:5000 - ourapi.com/register, /login, /logout

// // {
// //     header{},
// //     data: {},
// //     status: 400
// // }


// // m0odel - user., student., teacher., course, department
// // routes - /register, /login, /logout, /allstudents, /allteachers, /allcourses, /alldepartments

// // MVC - model view (routes) controller 