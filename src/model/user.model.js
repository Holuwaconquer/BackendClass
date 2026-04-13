const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
    resetCode: {type: Number},
    registrationDate: {type: Date, default: Date.now}
})
// const saltRound = 10;
// // password, saltRound, 

// userSchema.pre('save', async function(next) {
//     if(!this.isModified('password')) return next();

//     try{
//         this.password = await bcryptjs.hash(this.password, saltRound)
//         return next()
//     }catch(err){
//         next(err)
//     }
// })



// password = samad - sdhfklj - dldashfkjdhsf - dslfjhasdkf -sdfjhdaskj - dsfhdksjf (bcryptjs)

const userModel = mongoose.model('UserColl', userSchema)

module.exports = userModel