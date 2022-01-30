const express = require('express')

// .envFile
require('dotenv').config()

const app = express()
const port = process.env.PORT

// responsible for connection between backend and forntend
const cors = require('cors')
const Task = require('./models/task')
const User = require('./models/user')

app.use(cors())
require('./db/mongoose')



app.use(express.json())
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

app.use(userRouter)
app.use(taskRouter)
// CRUD OPERATIONS 
// create --> post
// read --> get
// update --> patch
// delete --> delete
// app.get('/test',(req,res)=>{
//     res.send('Testinggg')
// })


////////////////////////////////////////////////////////////////////////////////

// bcryptjs
// npm i bcryptjs
// const bcrypt = require('bcryptjs')
// const passwordFunction = async () =>{
//     const password = 'R123456'
//     const hashedPassword = await bcrypt.hash(password,8)
//     console.log(password)  // 'R123456'
//     console.log(hashedPassword) // 328476327452746521fvsdgafde673red

//     // compare  --> (true/false)
//     const compare = await bcrypt.compare('R123456',hashedPassword)
//     console.log(compare)

// }

// passwordFunction()

//////////////////////////////////////////////////////////////////////////////

// jsonwebtoken
// const jwt = require('jsonwebtoken')
// const myToken = async() =>{
//     // sign --> create token
//     const token = jwt.sign({_id:'123'},'nodecourse')
//     console.log(token)

//     // verify --> check validtiy of token
//     const tokenVerify = jwt.verify(token,'nodecourse')
//     console.log(tokenVerify)
// }
// myToken()

////////////////////////////////////////////////////////////////////////////

// Express middelware
/**
 * Before middelware
 * new request --> run route handler
 * 
 * After middelware
 * new request --> do sth (check token valid or invalid) --> run route hanlder
 */
////////////////////////////////////////////////////////////////////////////

// populate

// const main = async()=>{
//     // get user account
//     const task = await Task.findById('61e55c5f64cf9c4ba600d317')
//     await task.populate('owner')  //6327546235462354326
//     console.log(task.owner)

//     // get all tasks 
//     const user = await User.findById('61e442472260abefe4e13f34')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()

app.listen(port,()=>{console.log('Listening on port 3000')})

/////////////////////////////////////////////////////////////////////////////

// API 
// npm init -y
// npm i mongoose 
// 1) connection
// 2) Model --> properties of each document/ validations / logic
// 3) Routers --> CRUD 
// 4) main page (index.js / app.js) --> nodemon src/index.js
