// npm init -y
// npm i mongoose
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true //'       omar           ' --> 'omar'
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,  // 'AMR@GMAIL.COM' --> 'amr@gmial.com
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        } 

    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('Age must be a postive number')
            }
        }
    },
    password:{
      type:String,
      required:true,
      trim:true,
      minlength:6  
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    phonenumber:{
        type:String,
        validate(value){
            if(!validator.isMobilePhone(value,'ar-EG')){
                throw new Error('Phone number is invalid')
            }
        }
    }
    // ref
    // tasks:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref:'Task'
    // }]
},
{
    timestamps:{currentTime:()=>new Date().getTime() + (2*60*60*1000)}
})

// timestamps 
//////////////////////////////////////////////////////////////////////////////////////

// relations 
userSchema.virtual('tasks',{
  ref:'Task', // name of collection relation
  localField:'_id', 
  foreignField:'owner'
})










// hash password
// user --> save (mongosse middelware (pre))
// user --> action (hashong password) -->save
userSchema.pre('save',async function(next){
    // this --> document of user
    const user = this
    if(user.isModified('password'))
   { user.password = await bcrypt.hash(user.password,8)}

//    next()
})

///////////////////////////////////////////////////////////////////////////

// login 
// statics allow you to call function on your model --> check login route
userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    // console.log(user)
    if(!user){
        throw new Error ('Unable to login..please check email')
    }
    // 123456 --> req.body.password  --> user.password
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login.. please check password')
    }

    return user
}

////////////////////////////////////////////////////////////////////////////

// generate token
// methods call function on variable 
userSchema.methods.generateToken = async function(){
    // this --> document
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat(token)
    // mutation
    // const x = user.tokens.push(token)
    // console.log(x)
    // user.tokens = user.tokens.push(token)
    await user.save()
    // console.log(user.tokens)
    return token
}

/////////////////////////////////////////////////////////////////////////////

userSchema.methods.toJSON = function (){
    // document
    const user = this

    // convert document to object
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}

const User = mongoose.model('User',userSchema)

module.exports = User