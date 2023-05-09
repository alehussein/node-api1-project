// BUILD YOUR SERVER HERE

const express = require('express')
const server = express()
server.use(express.json());

module.exports = server; // EXPORT YOUR SERVER instead of {}

const User = require('./users/model')


server.get('/api/users', async (req, res) => {
  try {
    const user = await User.find()
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({
      message: "The users information could not be retrieved",
      err: err.message
    })
  }
})

server.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const possibleUser = await User.findById(req.params.id)
    const find = await User.findById(id)
    if (!possibleUser) {
      res.status(404).json({ message: `The user with the specified ID does not exist` })
    } else {
      res.status(200).json(find)
    }
  } catch (err) {
    res.status(500).json({ message: "The user information could not be retrieved" })
  }
})

server.post('/api/users', async (req, res) => {
  try {
    const user = req.body
    // const insert = await User.insert(user)
    if (!user.name || !user.bio) {
      res.status(400).json({
        message: "Please provide name and bio for the user"
      })
    } else {
      User.insert(user)
        .then(createUser => {
          res.status(201).json(createUser)
        })
      // res.status(201).json({message: 'User is create',
      //   insert})
    }
  } catch (err) {
    res.status(500).json({ message: "There was an error while saving the user to the database" })
  }
})
  
server.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({
        message: `The user with the specified ID does not exist`
      })
    } else {
      const deleteUser = await User.remove(user.id)
      res.status(200).json(deleteUser)
    }
  } catch (err) {
    res.status(500).json({
      message: "The user could not be removed",
      err: err.message
    })
  }

})
  
  
server.put('/api/users/:id', async (req, res) => {
  try {

    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
      res.status(404).json({ 
        message: `The user with the specified ID , does not exist`, 
      })
    } else {
      if (!req.body.name || !req.body.bio) {
        res.status(400).json({
          message: "Please provide name and bio for the user",
        })
      } else {
        const updatedUser = await User.update(
          req.params.id, 
          req.body,
          )
        res.status(200).json(updatedUser)
      }
    }

  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified",
      err: err.message
    })
  }
})
