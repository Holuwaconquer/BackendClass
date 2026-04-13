const express = require('express')
const { RegisterUser, LoginUser, getAllUsers, getUserById, resetPassword, verifyEmail, deleteUser, updateUser, patchUser, getUser, promoteToAdmin, forgotPassword } = require('../controller/userController')

const { verifyToken, isAdmin } = require('../../middleware/authMiddleware')
const router = express.Router()

router.post('/register-user', RegisterUser)
router.post('/login', LoginUser)

router.get('/all-users', verifyToken, isAdmin, getAllUsers)
router.get('/get-user/:id', getUserById)
router.delete('/delete-user/:id', verifyToken, deleteUser)
router.put('/update-user/:id', updateUser)
router.patch('/patch-user/:id', patchUser)
router.get('/user', verifyToken, getUser)
router.post('/forgot-password', forgotPassword)
router.post('/verify-email', verifyEmail)
router.post('/reset-password', resetPassword)

router.patch('/promote-admin', verifyToken, isAdmin, promoteToAdmin)

module.exports = router

// localhost:4000/user/register-user/

// CORS - Cross Origin Resource Sharing

// login - token - frontend - localstorage/cookie - data.role (isAdmin/user) - admin Dashboard / dashboard 
// dashboard(onload) - token (from localstorage/cookie) - - requests to get user details -  backend (/getuserdetails) - backend decode token (userdetails) - query database to get user details -  backend send userdetails to frontend - frontend (userdetails) - dashboard displays userdetails
// student result -token - 