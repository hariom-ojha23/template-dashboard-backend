const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const bcrypt = require('bcryptjs')

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    const userExist = await User.findOne({ email })

    if (userExist) {
      res.status(400)
      res.send('User already exist')
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      fullName,
      email,
      password: hashPassword,
    })

    if (user) {
      res.status(201).json({
        userData: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      res.send('Internal Server Error, Please try again')
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`)
  }
})

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.status(201).json({
        userData: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      res.send('Invalid Credentials')
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`)
  }
})

module.exports = { registerUser, loginUser }
