const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middelware/auth')

// Post


router.post('/tasks', auth, async (req, res) => {
    try {
        // spread operator --> ... (copy of data)
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// get all 
// router.get('/tasks',auth,async(req,res)=>{
//     try{
//         const tasks = await Task.find({})
//         res.send(tasks)
//     }
//     catch(e){
//         res.status(500).send(e.message)
//     }
// })


router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// get by id

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        // 422(task id)     f34(id of current logged in user)  
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        console.log(task)
        if (!task) {
            return res.status(404).send('No task')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// patch 

router.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findOneAndUpdate({
            _id: id,
            owner: req.user._id
        }, req.body, {
            new: true,
            runValidators: true
        })
        if (!task) {
            return res.send('No task')
        }
        res.send(task)
    } catch (e) {
        res.send(e.message)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOneAndDelete({
            _id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send('No task')
        }
        res.send(task)
    } catch (e) {
        res.send(e.message)
    }
})



module.exports = router