const userModel = require("../model/user.model")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'catherinecar1994@gmail.com',
        pass: 'zqemgvhbptvoviuc'
    }
})

function mailOption(newUser){
    return {
        from: `Backend Class <catherinecar1994@gmail.com>`,
        to: newUser.email,
        subject: "Welcome to our platform!",
        html: `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Backend Class</title>
            </head>
            <body>
                <div style="background-color: navy; padding: 20px; color: white; border-radius: 10px; margin: 4px; gap: 10px;">
                    <h1 style="color: white; margin-bottom: 10px;">Hello, ${newUser.firstname} ${newUser.lastname}!</h1>
                    <img style="width: 50px; height: 50px; margin-bottom: 10px;" src="https://ci3.googleusercontent.com/meips/ADKq_NYNkYvl4Ov9s5JhJT6V5rFzjlPtKTsixSDweeX5yvVh5GnphOCEYaabzYJdp2hDT6VsUpNlue9NBDPBLkGv8Y1PDX1VwqkzN6VY3Q0-eMuPyvSuzpc01gs71ggPEuTMneI_7FiAJqmgPhogA1e3uFm2ugMKRvNtNsIxM7fXLsPYiRp0CecMb2p5EbzQGgmgdwEw9scF=s0-d-e1-ft#https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/paypal-rebranding/pp-logo-in-circle-2x.png" alt="PayPal Logo">
                    <h1 style="margin-bottom: 10px;">Welcome to the Backend Class</h1>
                    <p style="margin-bottom: 10px;">You’ve just opened a Backend Class account and are set to begin paying with backend around the world.</p>
                    <button style="background-color: white; color: navy; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;"> <a href="https://rukatechcollege.com" style="text-decoration: none; color: navy;">Get Started</a></button>
                </div>
            </body>
        </html>`
    }
}
const RegisterUser = async (req, res) => {
    // console.log('This is the request from the client: ', req.body)
    try{
    const { firstname, lastname, email, password, username, registrationDate } = req.body;
    if(!firstname || !lastname || !email || !password || firstname.trim() === '' || lastname.trim() === '' || email.trim() === '' || password.trim() === ''){
        console.log('the data must be inputed')
        res.status(404).json({
            status: false,
            message: 'All fields are required'
        })
    }
    
    const checkUser = await userModel.findOne({ email })
    // console.log(checkUser)
    
    if(checkUser){
        console.log('user already exist')
        res.status(404).json({
            status: false,
            message: 'User already exist with this email, please log in or use another email to register'
        })
    }
    
    const hashPassword = await bcryptjs.hash(password, 10)
    console.log('This is the hashed password: ', hashPassword)
    
    
    req.body.role = 'user'
    const newUser = new userModel({ ...req.body, password: hashPassword })
    await newUser.save()

    
    // console.log('This is the transporter object: ', transporter)
    // const mailOptions = {
    //     from: `Backend Class <catherinecar1994@gmail.com>`,
    //     to: newUser.email,
    //     subject: "Welcome to our platform!",
    //     // text: `Hello, ${newUser.firstname} ${newUser.lastname}! Welcome to our platform!`,
    //     html: htmlContent
    // }

    const emailSend = await transporter.sendMail(mailOption(newUser))

    console.log('This is the email send response: ', emailSend)

    res.status(201).json({
        status: true,
        message: 'User registration successful',
        data: {
            firstname: newUser.firstname,
            lastName: newUser.lastname, 
            email: newUser.email, 
            username: newUser.username,
            password: newUser.password,
            registrationDate: newUser.registrationDate, 
            role: newUser.role
        }
    })

   }catch(err){
    console.log('Error registering user: ', err)
    res.status(500).json({
        status: false,
        message: 'An error occurred while registering the user',
        error: err
    })
   } 
}

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        if(!email || !password){
            console.log('Email and Password required!')
            return res.status(401).json({
                status: false,
                message: "Email and Password required!"
            })
        }

        const userExits = await userModel.findOne({ email })
        if(!userExits){
            console.log('no user found with this email')
            return res.status(404).json({
                status: false,
                message: "no user found with this email"
            })
        }

        // console.log("user exist in the collection", userExits)
        const isMatch = await bcryptjs.compare(password, userExits.password)
        if(!isMatch){
            console.log('Incorrect password')
            return res.status(400).json({
                status: false,
                message: "email or password is incorrect"
            })
        }else{

            const token = jwt.sign(
                { id: userExits._id, email: userExits.email, role: userExits.role },
                process.env.SECRET_KEY,
                { expiresIn: '7 minutes' } 
            )
            console.log('This is the generated token: ', token)
    
            res.status(200).json({
                status: true,
                message: "Login successful",
                data: {
                    firstname: userExits.firstname,
                    lastName: userExits.lastname,
                    email: userExits.email,
                    username: userExits.username,
                    registrationDate: userExits.registrationDate,
                    role: userExits.role
                },
                token
            })
        }

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            status: false,
            message: "An error occurred while logging in the user",
            error: err
        })
    }
}

const getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find()
        
        console.log('Users retrieved successfully: ', users)
        res.status(200).json({
            status: true,
            message: 'Users retrieved successfully',
            data: users
        })
    }catch(err){
        console.log('Error retrieving users: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while retrieving users'
        })
    }
}

const getUser = async (req, res) => {
    try{
        console.log('this is user details from the token: ', req.user)
    
        res.status(200).json({
            status: true,
            message: 'User retrieved successfully',
            data: req.user
        })

    }catch(err){
        console.log('Error retrieving user: ', err.message)
        if(err.name === 'JsonWebTokenError'){
            return res.status(401).json({
                status: false,
                message: 'Invalid token'
            })
        }
        res.status(500).json({
            status: false,
            message: 'An error occurred while retrieving the user'
        })
    }
}

const getUserById = async (req, res) => {
    try{
        const { id } = req.params;
        if(id.trim() === ''){
            console.log('User id is required')
            res.status(404).json({
                status: false,
                message: "user id is required"
            })
        }
        const user = await userModel.findById(id)

        if(!user){
            console.log('User not found with id: ', id)
            res.status(401).json({
                status: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            status: true,
            message: 'User retrieved successfully',
            data: user
        })

    }catch(err){
        console.log('Error retrieving user: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while retrieving the user'
        })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try{
        if(!id || !id.trim()){
            console.log('User id is required')
            res.status(404).json({
                status: false,
                message: "user id is required"
            })
        }

        const user = await userModel.findById(id)
        if(!user){
            console.log('User not found with id: ', id)
            res.status(401).json({
                status: false,
                message: 'User not found'
            })
        }

        await userModel.findByIdAndDelete(id)
        res.status(200).json({
            status: true,
            message: 'User deleted successfully',
            data: {userDeleted: user, allUserRemaining: await userModel.find()}
        })
    }
    catch(err){
        console.log('Error deleting user: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while deleting the user'
        })
    }
}

// PUT - (name, user, email), PATCH - (name)

const updateUser = async (req, res) => {
    const { id } = req.params;
    try{
        // const { firstname, lastname, email, password, username } = req.body

        const user = await userModel.findById(id)
        if(!user){
            console.log('User not found with id: ', id)
            res.status(401).json({
                status: false,
                message: 'User not found'
            })
        }

        const updateUser = await userModel.findByIdAndUpdate(
            id, req.body,
            { new: true, runValidators: true }
        )

        res.status(200).json({
            status: true,
            message: 'User updated successfully',
            data: updateUser
        })
    }

    catch(err){
        console.log('Error updating user: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while updating the user'
        })
    }
}

const patchUser = async (req, res) => {
    const { id } = req.params;
    try{
        // const { firstname, lastname, email, password, username } = req.body

        const user = await userModel.findById(id)
        if(!user){
            console.log('User not found with id: ', id)
            res.status(401).json({
                status: false,
                message: 'User not found'
            })
        }

        const updateUser = await userModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        res.status(200).json({
            status: true,
            message: 'User updated successfully',
            data: updateUser
        })
    }

    catch(err){
        console.log('Error updating user: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while updating the user'
        })
    }
}


const promoteToAdmin = async (req, res) => {
    const { email } = req.body; 

    try{
        const userToPromote = await userModel.findOne({email})

        if(!userToPromote){
            console.log("User not found with this email: ", email)
            res.status(404).json({
                status: false,
                message: 'User not found with this email'
            })
        }

        const promoteToAdmin = await userModel.findByIdAndUpdate(
            userToPromote._id,
            { role: 'admin' },
            { new: true, runValidators: true }
        )
        
        res.status(200).json({
            status: true,
            message: 'User promoted to admin successfully',
            data: promoteToAdmin
        })
    }

    catch(err){
        console.log('Error promoting user to admin: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while promoting the user to admin'
        })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try{
        if(!email || email.trim() === ''){
            console.log('Email is required')
            return res.status(404).json({
                status: false,
                message: 'Email is required'
            })
        }

        const user = await userModel.findOne({ email })
        if(!user){
            console.log('No user found with this email: ', email)
            return res.status(404).json({
                status: false,
                message: 'No user found with this email'
            })
        }

        const code = Math.floor(1000000 + Math.random() * 9000000)
        console.log('Generated reset code: ', code)

        user.resetCode = code
        await user.save()

        const sendCode = await transporter.sendMail({
            from: `Backend Class <backendclass@example.com>`,
            to: user.email,
            subject: 'Password Reset Code',
            text: `Hello ${user.firstname},\n\nYour password reset code is: ${code}`
        })

        console.log('Reset code email sent: ', sendCode)
        res.status(200).json({
            status: true,
            message: 'Password reset code sent to email'
        })

    }catch(err){
        console.log('Error sending reset code email: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while sending the reset code email'
        })
    }
}

const verifyEmail = async (req, res) => {
    const { code } = req.body;
    const { email } = req.query;
    try{
        if(!code || !email || email.trim() === ''){
            console.log('Reset code and email are required')
            return res.status(404).json({
                status: false,
                message: 'Reset code and email are required'
            })
        }

        const user = await userModel.findOne({ email })
        if(!user){
            console.log('No user found with this email: ', email)
            return res.status(404).json({
                status: false,
                message: 'No user found with this email'
            })
        }

        if(user.resetCode !== parseInt(code)){
            console.log('Invalid reset code')
            return res.status(404).json({
                status: false,
                message: 'Invalid reset code'
            })
        }

        if(user.resetCode === code){
            console.log('Email verified successfully')
            return res.status(200).json({
                status: true,
                message: 'Email verified successfully'
            })
        }

    }catch(err){
        console.log('Error verifying email: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while verifying the email'
        })

    }
}

const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { email, code } = req.query;

    try{
        if(!newPassword || !email || !code || email.trim() === ''){
            console.log('New password, email, and reset code are required')
            return res.status(404).json({
                status: false,
                message: 'New password, email, and reset code are required'
            })
        }

        const user = await userModel.findOne({ email })
        if(!user){
            console.log('No user found with this email: ', email)
            return res.status(404).json({
                status: false,
                message: 'No user found with this email'
            })
        }

        if(user.resetCode !== parseInt(code)){
            console.log('Invalid reset code')
            return res.status(404).json({
                status: false,
                message: 'Invalid reset code'
            })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetCode = null
        await user.save()

        console.log('Password reset successfully')
        res.status(200).json({
            status: true,
            message: "Password has been reset successfully"
        })

    }catch(err){
        console.log('Error resetting password: ', err)
        res.status(500).json({
            status: false,
            message: 'An error occurred while resetting the password'
        })
    }
}

module.exports = {
    RegisterUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    patchUser,
    LoginUser,
    getUser,
    promoteToAdmin,
    forgotPassword,
    verifyEmail,
    resetPassword
}

// first - user info
// second - time frame of the token (to track when the token will expire)

// Nodemailer - to send email to the user for password reset, account verification, etc.
// reset password - email - generate a code (math.random (6 digits)) - save that code in the database (user document) - send that code to the user email - user input the code (send to backend) - verify the code in the database (compare the code provided by the user with the one saved in the database) - if the code match 