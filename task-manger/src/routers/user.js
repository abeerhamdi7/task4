const express = require('express')

const router = express.Router()

const User = require('../models/user')

const auth = require('../middelware/auth')

// facebook.com --> signup
// localhost:3000/users --> signup
// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

// router.post('/signup', (req, res) => {
//     // console.log(req.body)
//     const user = new User(req.body)
//     user.save().then(() => {
//         // console.log('hello')
//         res.send(user)
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

router.post('/signup', async (req, res) => {
    try{
        const user = new User(req.body) // {}
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }

})
//////////////////////////////////////////////////////////////////////////

// login

router.post('/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

////////////////////////////////////////////////////////////////////////////////

// profile 
router.get('/profile',auth,async(req,res)=>{
    res.send(req.user)
})

///////////////////////////////////////////////////////////////////////////////////

// get all users
// localhost:3000/users
router.get('/users', auth,(req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

// get user by id 
// localhost:3000/users/894758347658347653
// localhost:3000/users/id
router.get('/users/:id',auth,(req,res)=>{
    // req.params --> return object having value of id entered in url (localhost:3000/users/894758347658347653)
    // console.log(req.params)
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
          return  res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

/////////////////////////////////////////////////////////////////////////////////

// update  (before hash password)
// router.patch('/users/:id',async (req,res)=>{
//     const _id = req.params.id
//    try{
//        // bypass middleware (pre)
//        const user = await User.findByIdAndUpdate(_id,req.body,{
//            //return new data after update
//            new:true,
//            // check model validations
//            runValidators:true
//        })
//        if(!user){
//            return res.status(404).send('Unable to find user')
//        }
//        res.status(200).send(user)
//    }catch(e){
//        res.status(400).send(e.message)
//    }
// })
///////////////////////////////////////////////////////////////////////////////

router.patch('/users/:id',auth,async (req,res)=>{
    const _id = req.params.id
    /**
     * {"name":"mahmoud",
    "password":"123456789"
}
     */
    const updates = Object.keys(req.body)
    // console.log(updates)
   try{
       // bypass middleware (pre)
       const user = await User.findById(_id)
       if(!user){
        return res.status(404).send('Unable to find user')
    }
       console.log(user)
       // ['name','age']
       // name = amr --> osama
       updates.forEach((update)=> (user[update] = req.body[update]))
       await user.save()
       // 1st loop
       //updates.forEach((name)=> (user.name = req.body.name))
       // 2nd loop
       // updates.forEach((password)=> (user.password = req.body.password))
    //    user.name = req.body.name
    //    user.password = req.body.password
       
       res.status(200).send(user)
   }catch(e){
       res.status(400).send(e)
   }
})

////////////////////////////////////////////////////////////////////////////////

// delete 
router.delete('/users/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send('No user is found')
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})
///////////////////////////////////////////////////////////////////////////////

// logout 

router.delete('/logout',auth,async(req,res)=>{
    try{
        // console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el)=>{
            /**
             * 12     12 !== 123 T
             * 1       1 !== 123 T
             * 2       2 !== 123 T
             * 123     123 !== 123 F
             * 
             * 6OQI !== 34GK T
             * 34Gk  !== 34GK F
             */
            return el !== req.token
        })
        await req.user.save()
        res.send('Logout Successfully')
    }
    catch(e){
       res.status(500).send(e)
    }
})

// logoutall 
router.delete('/logoutall',auth,async(req,res)=>{
   try{
        req.user.tokens = []
    await req.user.save()
    res.send('Logout all was done successfully')
   }
   catch(e){
       res.send(e)
   }
   
})











////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// description : required trim string
// completed : boolean default false
// routers --> CRUD operations async/ await 
// test

module.exports = router
